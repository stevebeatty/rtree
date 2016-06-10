define(['al/geom/RTree', 'al/geom/Rect'], function(RTree, Rect) {
    describe("geom.RTree", function() {
        
        var rtree, r1, r2, r3, r4, r5, e1, e2, e3, e4, e5, entries;
        
        beforeEach(function() {
            rtree = new RTree();
            r1 = new Rect(0, 0, 0.25, 0.25);
            r2 = new Rect(0.25, 0.25, 0.5, 0.5);
            r3 = new Rect(0.5, 0.5, 0.75, 0.75);
            r4 = new Rect(0.15, 0.15, 0.65, 0.65);
            r5 = new Rect(0.35, 0.1, 0.4, 0.85);
            e1 = new rtree.Entry(r1, 1);
            e2 = new rtree.Entry(r2, 2);
            e3 = new rtree.Entry(r3, 3);
            e4 = new rtree.Entry(r4, 4);
            e5 = new rtree.Entry(r5, 5);
            entries = [e1, e2, e3, e4, e5];
        });
        
        describe("initial construction", function() {
            
            it("size should be 0", function() {
                expect(rtree.size).toBe(0);
            });
            
            it("height should be 0", function() {
                expect(rtree.height).toBe(0);
            });
            
            it("root should not exist", function() {
                expect(rtree.root).toBeNull();
            });
        });
        
        
        describe("internal methods for entries", function() {
            
            describe("_findBoundary", function() {
                it("should bound all entries", function() {
                    var bound = rtree._findBoundary(entries);
                        
                    expect(bound.xMin).toBe(0);
                    expect(bound.xMax).toBe(0.75);
                    expect(bound.yMin).toBe(0);
                    expect(bound.yMax).toBe(0.85);
                }); 
                
            });
            
            describe("_chooseByLeastEnlargement", function() {
           
                it("should select e1 since that completely contains Rect(0.1, 0.1, 0.2, 0.2)", function() {
                    expect(rtree._chooseByLeastEnlargement(entries, new Rect(0.1, 0.1, 0.2, 0.2))).toBe(e1);
                });
            
                it("should select e2 since it completely contains Rect(0.3, 0.3, 0.4, 0.4) but has less area than e4", function() {
                    expect(rtree._chooseByLeastEnlargement(entries, new Rect(0.3, 0.3, 0.4, 0.4))).toBe(e2);
                });
                
                it("should select e4 since it only completely contains Rect(0.2, 0.2, 0.6, 0.6)", function() {
                    expect(rtree._chooseByLeastEnlargement(entries, new Rect(0.2, 0.2, 0.6, 0.6))).toBe(e4);
                });
             });
             
            describe("_findExtreme[X|Y]", function() {
           
                it("_findExtremeX should find [e3, e1]", function() {
                    var ext = rtree._findExtremeX(entries),
                        extLow = ext[0],
                        extHigh = ext[1];
                        
                    expect(extLow).toBe(e3);
                    expect(extHigh).toBe(e1);
                });
                
                it("_findExtremeY should find [e3, e1]", function() {
                    var ext = rtree._findExtremeY(entries),
                        extLow = ext[0],
                        extHigh = ext[1];
                        
                    expect(extLow).toBe(e3);
                    expect(extHigh).toBe(e1);
                });
            
            });
            
            
            
            describe("_linearPickSeeds", function() {
                it("should pick the pair with greatest normalized separation [e3, e1]", function() {
                    var seeds = rtree._linearPickSeeds(entries),
                        low = seeds[0],
                        high = seeds[1];
                        
                    expect(low).toBe(e3);
                    expect(high).toBe(e1);
                }); 
                
            });
            
            describe("_linearSplit", function() {
                it("should divide the entries into two nodes", function() {
                    var nodeA = new rtree.Node(),
                        nodeB = rtree._linearSplit(entries, nodeA);
                        
                    expect(nodeA.entries).toContain(e3);
                    expect(nodeA.entries).toContain(e2);
                    expect(nodeA.entries).toContain(e5);
                    
                    expect(nodeB.entries).toContain(e1);
                    expect(nodeB.entries).toContain(e4);
                }); 
                
            });
            
            describe("_addEntry", function() {
                it("should return a new node if the node to modify is falsy", function() {
                    var node = rtree._addEntry(null, e1);
                    
                    expect(node).not.toBeNull();
                    expect(node.entries.length).toBe(1);
                    expect(node.entries).toContain(e1);
                });
                
                it("should just add the entry if there is room", function() {
                    var node = new rtree.Node(),
                        newNode = rtree._addEntry(node, e1);
                    
                    expect(newNode).toBeNull();
                    expect(node.entries.length).toBe(1);
                    expect(node.entries).toContain(e1);
                });
                
                it("should split the node if there is not room", function() {
                    var node = new rtree.Node(),
                        e6 = new rtree.Entry(r1, 6);
                        
                    node.entries = entries;
                    var newNode = rtree._addEntry(node, e6);
                    
                    expect(newNode).not.toBeNull();
                    expect(node.entries.length >= rtree.minEntries).toBe(true);
                    expect(newNode.entries.length >= rtree.minEntries).toBe(true);
                });
                
            });
            
            
            describe("_adjustTree", function() {
                it("should set root if it is currently null", function() {
                    var newNode = new rtree.Node();
                        newNode.entries.push(e1);
                    
                    expect(rtree.root).toBeNull();
                    
                    rtree._adjustTree([], newNode);
                    
                    expect(rtree.root).not.toBeNull();
                    expect(rtree.height).toBe(1);
                });
                
            });
            
        });
        
        
        describe("public methods", function() {
            
            describe("insert", function() {
                it("should set root if it is currently null", function() {
                    expect(rtree.root).toBeNull();
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    
                    rtree.insert(r1, 1);
                    
                    expect(rtree.root).not.toBeNull();
                    expect(rtree.size).toBe(1);
                    expect(rtree.height).toBe(1);
                });
                
                it("should not split until maxEntries have been inserted", function() {
                    expect(rtree.root).toBeNull();
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    
                    rtree.insert(r1, 1);
                    rtree.insert(r2, 2);
                    rtree.insert(r3, 3);
                    rtree.insert(r4, 4);
                    rtree.insert(r5, 5);
                    

                    expect(rtree.size).toBe(5);
                    expect(rtree.height).toBe(1);
                });
                
                it("should split after maxEntries + 1 have been inserted", function() {
                    expect(rtree.root).toBeNull();
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    
                    rtree.insert(r1, 1);
                    rtree.insert(r2, 2);
                    rtree.insert(r3, 3);
                    rtree.insert(r4, 4);
                    rtree.insert(r5, 5);
                    rtree.insert(r1, 6);

                    expect(rtree.size).toBe(6);
                    expect(rtree.height).toBe(2);
                    expect(rtree.root.entries.length).toBe(2);
                    expect(rtree.root.entries[0].value.entries.length >= rtree.minEntries).toBe(true);
                    expect(rtree.root.entries[1].value.entries.length >= rtree.minEntries).toBe(true);
                });
                
            });
            
            describe("delete", function() {
                it("should delete an rtree of size 1", function() {
                    expect(rtree.root).toBeNull();
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    
                    rtree.insert(r1, 1);
                    
                    expect(rtree.root).not.toBeNull();
                    expect(rtree.size).toBe(1);
                    expect(rtree.height).toBe(1);
                    
                    rtree.delete(rtree.root.entries[0]);
                    
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    expect(rtree.root).toBeNull();
                });
                
                it("shouldn't changed the size if the entry to delete is invalid", function() {
                    rtree.insert(r1, 1);

                    rtree.delete(e1);
                    
                    expect(rtree.size).toBe(1);
                    expect(rtree.height).toBe(1);
                    expect(rtree.root).not.toBeNull();
                });
                
                it("should delete an rtree of size 2", function() {
                    expect(rtree.root).toBeNull();
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    
                    rtree.insert(r1, 1);
                    rtree.insert(r2, 2);
                    
                    expect(rtree.root).not.toBeNull();
                    expect(rtree.size).toBe(2);
                    expect(rtree.height).toBe(1);
                    
                    rtree.delete(rtree.root.entries[0]);

                    expect(rtree.size).toBe(1);
                    expect(rtree.height).toBe(1);
                    expect(rtree.root).not.toBeNull();
                    
                    rtree.delete(rtree.root.entries[0]);

                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    expect(rtree.root).toBeNull();
                });
                
                it("should delete an rtree of size 6", function() {
                    expect(rtree.root).toBeNull();
                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    
                    rtree.insert(r1, 1);
                    rtree.insert(r2, 2);
                    rtree.insert(r3, 3);
                    rtree.insert(r4, 4);
                    rtree.insert(r5, 5);
                    rtree.insert(r1, 6);
                    
                    expect(rtree.root).not.toBeNull();
                    expect(rtree.size).toBe(6);
                    expect(rtree.height).toBe(2);
                    
                    rtree.delete(rtree.randomEntry());
                    rtree.delete(rtree.randomEntry());
                    rtree.delete(rtree.randomEntry());

                    expect(rtree.size).toBe(3);
                    expect(rtree.root.entries.length).toBe(3);
                    expect(rtree.height).toBe(1);
                    
                    rtree.delete(rtree.randomEntry());
                    rtree.delete(rtree.randomEntry());
                    rtree.delete(rtree.randomEntry());

                    expect(rtree.size).toBe(0);
                    expect(rtree.height).toBe(0);
                    expect(rtree.root).toBeNull();
                });
                
            });
            
            
            describe("search", function() {
                it("should find the entry in an rtree of 1", function() {
                    rtree.insert(r1, 1);
                    
                    var result = rtree.search(r1);
                    expect(result).not.toBeNull;
                    expect(result.length).toBe(1);
                    expect(result[0].rect).toBe(r1);
                });
                
                it("should find the entries on boundary in an rtree of 2", function() {
                    rtree.insert(r1, 1);
                    rtree.insert(r2, 2);
                    
                    var result = rtree.search(r2);
                    expect(result.length).toBe(2);
                    
                    result = rtree.search(r1);
                    expect(result.length).toBe(2);
                });
                
                it("should not find entries if there are no elements in search rect", function() {
                    rtree.insert(r1, 1);
                    rtree.insert(r5, 2);
                    
                    var result = rtree.search(r3);
                    expect(result.length).toBe(0);
                });
            });
            
        });
        
        
    });
});