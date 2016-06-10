define(['al/geom/Rect', 'underscore', 'al/math/Random'], function(Rect, US, Random) {
    'use strict';

    /**
     * An Entry in a Node of an RTree
     * @param {Rect} rect
     * @param {type} value
     */
    function Entry(rect, value) {
        this.rect = rect;
        this.value = value;
    }
    
    Entry.prototype.toString = function() {
        return "<" + this.value + ", " + this.rect + ">";
    };
    
    /**
     * A Node of an RTree
     * @param {Array} entries
     */
    function Node(entries) {
        this.entries = entries || [];
    }
    
    Node.prototype.toString = function() {
        var str = "[";
        str += this.entries.join(', ');
        str += "]";
        return str;
    };

    /**
     * A 2D RTree (rectangle tree) that stores spatial data with a rectangle
     * boundary.
     * 
     * Based on Guttman, A. (1984). "R-Trees: A Dynamic Index Structure for Spatial Searching"
     * @see http://en.wikipedia.org/wiki/R-tree
     */
    function RTree() {
        /**
         * The number of entries in the entire tree
         */
        this.size = 0;
        
        /**
         * The height of tree or the number of levels.  Should be ~ log(size)
         */
        this.height = 0;
        
        /** 
         * this is M or the maximum number of entries per node
         */
        this.maxEntries = 5;
        
        /**
         * this is m or the minimum number of entries per node
         */ 
        this.minEntries = 2;
        
        /**
         * The root of the tree
         */
        this.root = null;
        
        /**
         * Constructor for a Node
         */
        this.Node = Node;
        
        /**
         * Constructor for an Entry in a Node
         */
        this.Entry = Entry;
    }
    
    /**
     * Finds the smallest boundary that fits the entries
     * 
     * @param {Array} entries
     * @returns {Rect}
     */
    RTree.prototype._findBoundary = function(entries) {
        var minX = entries[0].rect.xMin,
            maxX = entries[0].rect.xMax,
            minY = entries[0].rect.yMin,
            maxY = entries[0].rect.yMax;
        
        for (var i = 1; i < entries.length; i++) {
            var entry = entries[i];
            
            if (entry.rect.yMin < minY) minY = entry.rect.yMin;
            if (entry.rect.yMax > maxY) maxY = entry.rect.yMax;
            if (entry.rect.xMin < minX) minX = entry.rect.xMin;
            if (entry.rect.xMax > maxX) maxX = entry.rect.xMax;
        }
        
        return new Rect(minX, minY, maxX, maxY);
    };
    
    /**
     * Finds the entries that are the lowest high and the highest low 
     * in the X dimension.  Used by the linear pick seeds algorithm.
     * 
     * @param {Array} entries
     * @returns {Array}
     */
    RTree.prototype._findExtremeX = function(entries) {
        var highX = entries[0],
            lowX = highX;
        
        for (var i = 1; i < entries.length; i++) {
            var entry = entries[i];
            
            if (entry.rect.xMin > lowX.rect.xMin) lowX = entry;
            if (entry.rect.xMax < highX.rect.xMax) highX = entry;
        }
        return [lowX, highX];
    };
    
    /**
     * Finds the entries that are the lowest high and the highest low 
     * in the Y dimension.  Used by the linear pick seeds algorithm.
     * 
     * @param {Array} entries
     * @returns {Array}
     */
    RTree.prototype._findExtremeY = function(entries) {
        var highY = entries[0],
            lowY = highY;
        
        for (var i = 1; i < entries.length; i++) {
            var entry = entries[i];
            
            if (entry.rect.yMin > lowY.rect.yMin) lowY = entry;
            if (entry.rect.yMax < highY.rect.yMax) highY = entry;
        }
        return [lowY, highY];
    };
    
    /**
     * Picks the initial seeds for the linear split algorithm
     * 
     * @param {Array} entries
     * @returns {Array}
     */
    RTree.prototype._linearPickSeeds = function(entries) {
        // find entries on the extremities
        var extX = this._findExtremeX(entries),
            lowX = extX[0], // highest low
            highX = extX[1], // lowest high
            
            extY = this._findExtremeY(entries),
            lowY = extY[0], // highest low
            highY = extY[1]; // lowest high
        
        // separations of the X & Y extremes
        var separationX = lowX.rect.xMax - highX.rect.xMin,
            separationY = lowY.rect.yMax - highY.rect.yMin;
        
        // the boundary of all entries
        var bound = this._findBoundary(entries),
            sizeX = bound.width(),
            sizeY = bound.height();
        
        // scale by size
        separationX /= sizeX;
        separationY /= sizeY;
        
        if (separationX > separationY) return [lowX, highX];
        else return [lowY, highY];
    };
    
    /**
     * Picks the next entry when performing the linear split algorithm
     * 
     * @param {Array} entries
     */
    RTree.prototype._linearPickNext = function(entries) {
        return entries.pop();
    };
    
    /**
     * Splits the entries into two nodes according to the linear split algorithm.
     * nodeA is the preexisting node with its entries removed and placed into the
     * entries parameter.
     * 
     * @param {Array} entries
     * @param {Node} nodeA
     * @returns {this.Node} new Node
     */
    RTree.prototype._linearSplit = function(entries, nodeA) {
        var seeds = this._linearPickSeeds(entries),
            seedA = seeds[0],
            seedB = seeds[1];
        
        // remove seeds from list
        var remaining = US.without(entries, seedA, seedB),
            nodeB = new this.Node(), // split node
            rectA = seedA.rect,
            rectB = seedB.rect; 
        
        nodeA.entries.push(seedA);
        nodeB.entries.push(seedB);
        
        while (remaining.length > 0) {
            var entry = this._linearPickNext(remaining);
            // ensure miniums are met
            if (remaining.length <= this.minEntries - nodeA.entries.length) {
                nodeA.entries.push(entry);
                continue;
            } else if (remaining.length <= this.minEntries - nodeB.entries.length) {
                nodeB.entries.push(entry);
                continue;
            }
            
            // add to the node that requires least enlargement
            var expRectA = rectA.expand(entry.rect),
                enlargeA = expRectA.area() - rectA.area(),
                expRectB = rectB.expand(entry.rect),
                enlargeB = expRectB.area() - rectB.area();
            
            if (enlargeA < enlargeB) {
                nodeA.entries.push(entry);
                rectA = expRectA;
            } else {
                nodeB.entries.push(entry);
                rectB = expRectB;
            }
        }
        
        return nodeB;
    };
    
    /**
     * Splits the entries from one node into two in a manner dependent on
     * the split algorithm being used.
     * 
     * @param {Array} entries
     * @param {Node} nodeA
     * @returns {Node}
     */
    RTree.prototype._split = function(entries, nodeA) {
        return this._linearSplit(entries, nodeA);
    };
    
    /**
     * Adds the entry to the node.  If the node is null then a new Node will 
     * be created.
     * 
     * @param {Node|null} node
     * @param {Entry} entry
     * @returns {Node|null}
     */
    RTree.prototype._addEntry = function(node, entry) {
        if (!node) { // i.e. empty root
            node = new this.Node();
            node.entries.push(entry);
            return node;
        }
        
        // add the entry to the node and split if it overflows
        node.entries.push(entry);
        
        if (node.entries.length > this.maxEntries) {
            var entries = node.entries;
            node.entries = [];
            
           return this._split(entries, node);
        }
        
        return null;
    };
    
    /**
     * Removes an Entry from a Node
     * 
     * @param {Node} node
     * @param {Entry} entry
     */
    RTree.prototype._removeEntry = function(node, entry) {
        node.entries.splice(node.entries.indexOf(entry), 1);
    };
    
    /**
     * Adjusts the RTree to update the boundaries in nodes that may have been 
     * changed.  If a new node has been generated then incorporate it into the
     * tree.
     * 
     * @param {Array} pathBack path back to the root node
     * @param {Node=} newNode optional new node
     */
    RTree.prototype._adjustTree = function(pathBack, newNode) {
        // move up the tree adding nodes and changing boundaries
        while (pathBack.length > 0) {
            var parentArr = pathBack.pop(),
                pNode = parentArr[0],
                pEntry = parentArr[1];
            
            pEntry.rect = this._findBoundary(pEntry.value.entries);
            
            if (newNode) {
                var rect = this._findBoundary(newNode.entries),
                    entry = new this.Entry(rect, newNode);
                
                newNode = this._addEntry(pNode, entry);
            }
        }
        
        // grow the tree if needed
        if (newNode) {
            if (this.root === null) {
                this.root = newNode;
            } else {
                var rootBound = this._findBoundary(this.root.entries),
                    rootEntry = new this.Entry(rootBound, this.root),
                    
                    newNodeBound = this._findBoundary(newNode.entries),
                    newNodeEntry = new this.Entry(newNodeBound, newNode),
                    
                    newRoot = new this.Node();
                
                newRoot.entries.push(rootEntry);
                newRoot.entries.push(newNodeEntry);
                
                this.root = newRoot;
            }
            this.height++;
        }
    };
    
    /**
     * Helper function for insert.  Places entry in the best fit subtree at
     * the specified depth.
     * 
     * @param {Entry} entry
     * @param {Number} depth
     */
    RTree.prototype._insert = function(entry, depth) {
        var pathToNode = [],
            node = this._chooseSubtree(entry.rect, pathToNode, depth), // aka L
            newNode = this._addEntry(node, entry);  // the split node if any
            
        this._adjustTree(pathToNode, newNode);
    };
    
    /**
     * Inserts the value, with the Rect boundary, into the tree.
     * @param {Rect} r Rect boundary
     * @param {type} value
     */
    RTree.prototype.insert = function(r, value) {
        var entry = new this.Entry(r, value); // aka E
        this._insert(entry, this.height);
        this.size++;
    };
    
    /**
     * Helper function for search.
     * 
     * @param {Rect} r search rectangle
     * @param {Node} node node to start search in
     * @param {Number} depth current depth of search
     * @param {Array} found entries that overlap the search rectangle
     */
    RTree.prototype._search = function(r, node, depth, found) {
        for (var i = 0; i < node.entries.length; i++) {
            var entry = node.entries[i];
            if (entry.rect.intersects(r)) {
                if (depth === this.height) {
                    found.push(entry);
                } else {
                    this._search(r, entry.value, depth + 1, found);
                }
            }
        }
    };
    
    /**
     * Searches the tree to find all values that overlap the search rectangle
     * 
     * @param {Rect} r search rectangle
     * @returns {Array} array of matching entries
     */
    RTree.prototype.search = function(r) {
        var found = [];
        if (this.root !== null) {
            this._search(r, this.root, 1, found);
        }
        return found;
    };
    
    /**
     * Deletes the entry from the tree.
     * 
     * @param {Entry} entry entry to be deleted
     */
    RTree.prototype.delete = function(entry) {
        var path = [],
            leaf = this._findLeaf(entry, path);
        
        if (!leaf) return;
        
        this._removeEntry(leaf, entry);
        this.size--;
        this._condenseTree(path);

        if (this.size === 0) {
            this.root = null;
            this.height = 0;
        } else if (this.root.entries.length === 1 && this.height > 1) {
            this.root = this.root.entries[0].value;
            this.height--;
        }
    };
    
    /**
     * Helper function for _findLeaf.  Tries to find a specific entry in the 
     * tree and returns the containing node, if found.
     * 
     * @param {Entry} e The entry to find
     * @param {Node} node The node to search from
     * @param {Number} depth the current depth of the search
     * @param {Array} pathBack The path back to the root
     * @returns {Node|undefined} The node containing the entry, if found or undefined
     *          if no node is found
     */
    RTree.prototype.__findLeaf = function(e, node, depth, pathBack) {
        for (var i = 0; i < node.entries.length; i++) {
            var entry = node.entries[i];
            
            if (entry.rect.intersects(e.rect)) {
                if (depth === this.height) {
                    if (e === entry) return node;
                } else {
                    var foundLeaf = this.__findLeaf(e, entry.value, depth + 1, pathBack);
                    if (foundLeaf) {
                        pathBack.push([node, entry, this.height - depth]);
                        return foundLeaf;
                    }
                }
            }
        }
    };
    
    /**
     * Finds a specific entry in the tree
     * 
     * @param {Entry} entry The Entry to find
     * @param {Array} pathBack path from the found node to the root
     * @returns {Node|undefined}
     */
    RTree.prototype._findLeaf = function(entry, pathBack) {
        var leaf = this.__findLeaf(entry, this.root, 1, pathBack);
        pathBack.reverse();
        return leaf;
    };
    
    /**
     * Choose from the array of entries to find the one that requires the least 
     * area enlargement to accomodate r
     * 
     * @param {Array} entries the Entries to search
     * @param {Rect} r the Rect to test
     * @returns {Entry} the entry with least enlargement
     */
    RTree.prototype._chooseByLeastEnlargement = function(entries, r) {
        var best = entries[0],
            bBoundRect = best.rect.expand(r),
            bestBoundArea = bBoundRect.area(),
            bestEnlargement = bestBoundArea - best.rect.area();

        for (var i = 1; i < entries.length; i++) {
            var entry = entries[i],
                boundRect = entry.rect.expand(r),
                boundRectArea = boundRect.area(),
                enlargement = boundRectArea - entry.rect.area();
            
            if (enlargement < bestEnlargement) {
                best = entry;
                bestEnlargement = enlargement;
                bestBoundArea = boundRectArea;
            } else if (enlargement === bestEnlargement) {
                if (boundRectArea < bestBoundArea) {
                    best = entry;
                    bestBoundArea = boundRectArea;
                }
            }
        }

        return best;
    };
    
    /**
     * Choose the leaf node that best fits r by successively choosing entries
     * using _chooseByLeastEnlargement
     * 
     * @param {Rect} r the search rectangle
     * @param {Array} pathBack path from the leaf to the root
     * @returns {Node}
     */
    RTree.prototype._chooseLeaf = function(r, pathBack) {
        var N = this.root;

        var depth = 1;
        while (depth < this.height) {
            var entry = this._chooseByLeastEnlargement(N.entries, r);
            pathBack.push([N, entry]);

            N = entry.value;
            depth++;
        }

        return N;
    };
    
    /**
     * Choose the subtree node that best fits r by successively choosing entries
     * using _chooseByLeastEnlargement.  Similar to _chooseLeaf but allows specifying
     * the maximum depth to search
     * 
     * @param {Rect} r the search rectangle
     * @param {Array} pathBack path from the leaf to the root
     * @returns {Node}
     */
    RTree.prototype._chooseSubtree = function(r, pathBack, nodeDepth) {
        var N = this.root;

        var depth = 1;
        while (depth < nodeDepth) {
            var entry = this._chooseByLeastEnlargement(N.entries, r);
            pathBack.push([N, entry]);

            N = entry.value;
            depth++;
        }

        return N;
    };
    
    /**
     * Condenses the tree after a deletion is performed.
     * 
     * @param {Array} pathBack the path back to the root
     */
    RTree.prototype._condenseTree = function(pathBack) {
        var toInsert = [];

        // move up the tree removing nodes and changing boundaries
        while (pathBack.length > 0) {
            var parentArr = pathBack.pop(),
                pNode = parentArr[0],
                pEntry = parentArr[1],
                depth = parentArr[2],
                childNode = pEntry.value;

            // remove the child if it has less than the allowed entries
            if (childNode.entries.length < this.minEntries) {
                while (childNode.entries.length > 0) {
                    toInsert.push([depth - 1, childNode.entries.pop()]);
                }
                this._removeEntry(pNode, pEntry);
            } else {
                pEntry.rect = this._findBoundary(pEntry.value.entries);
            }
        }

        // reinsert
        while (toInsert.length > 0) {
            var pair = toInsert.pop(),
                depth = this.height - pair[0],
                ent = pair[1];
            
            this._insert(ent, depth);
        }
    };

    /**
     * Returns a random entry from the list of entries in a node
     * 
     * @param {Node} node
     * @returns {Entry}
     */
    RTree.prototype._randomEntry = function(node) {
        var i = Random.uniformInt(0, node.entries.length);
        var e = node.entries[i];
        return e;
    }
    
    /**
     * Returns a random value Entry from the entire tree
     * 
     * @returns {Entry}
     */
    RTree.prototype.randomEntry = function() {
        var depth = 1,
            node = this.root,
            entry;

        while (depth <= this.height) {
            entry = this._randomEntry(node);
            node = entry.value;
            depth++;
        }
        return entry;
    }

    var colors = ['chartreuse', 'orange',  'green', 'blue', 'cyan', 'darkviolet', 'yellow', 'brown', 'black'];
    /**
     * Draws a single entry with color based on depth.
     * 
     * @param {type} ctx 2D drawing context
     * @param {Entry} entry the entry to draw
     * @param {type} depth the depth of the entry
     */
    RTree.prototype._drawEntry = function(ctx, entry, depth) {
        if (depth === this.height) {
            ctx.strokeStyle = 'red';
        } else if (depth < this.height) {
            ctx.strokeStyle = colors[depth % 10];
        }

        entry.rect.draw(ctx);
    };

    /**
     * Draws the contents of a node
     * 
     * @param {type} ctx 2D drawing context
     * @param {type} node the node to draw
     * @param {type} depth the depth of the node
     */
    RTree.prototype._drawNode = function(ctx, node, depth) {
        for (var i = 0; i < node.entries.length; i++) {
            var entry = node.entries[i];
            this._drawEntry(ctx, entry, depth);
            
            if (depth < this.height) {
                this._drawNode(ctx, entry.value, depth + 1);
            }
        }
    };

    /**
     * Draws the entire tree, with color coding by depth.  It is assumed that 
     * prior to calling this method, the drawing context is appropriatly transformed
     * to fit the values contained in the tree.
     * 
     * @param {type} ctx 2D drawing context
     */
    RTree.prototype.draw = function(ctx) {
        ctx.save();
        this._drawNode(ctx, this.root, 1);
        ctx.restore();
    };

    /**
     * Helper function for toString
     * 
     * @param {Node} node node to process
     * @param {type} indent indent to include before the value
     * @param {type} depth the depth of the node
     * @param {type} str value of the String so far
     * @returns {String} the acumulated string value
     */
    RTree.prototype._toString = function(node, indent, depth, str) {
        for (var i = 0; i < node.entries.length; i++) {
            var entry = node.entries[i];
            str += indent + entry.rect + "\n";
            if (depth < this.height) {
                str = this._toString(entry.value, indent + "  ", depth + 1, str);
            } else {
                str += indent + "  " + entry.value + "\n";
            }
        }
        
        return str;
    };

    /**
     * Returns a String representation of the RTree.  Will include the Rect values 
     * for all entries as well as the value for data entries.
     * 
     * @returns {String}
     */
    RTree.prototype.toString = function() {
        var str = "size: " + this.size + ", height: " + this.height + "\n";
        str = this._toString(this.root, "  ", 1, str);
        return str;
    };

    return RTree;
});