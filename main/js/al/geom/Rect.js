define(function() {
    'use strict';

    /**
     * An axis-aligned rectangle defined by a 
     * minimum (bottom-left) corner and a maximum (top-right)
     * corner
     * @param xMin
     * @param yMin
     * @param xMax
     * @param yMax
     * @returns
     */
    function Rect(xMin, yMin, xMax, yMax) {
        this.xMin = xMin;
        this.yMin = yMin;
        this.xMax = xMax;
        this.yMax = yMax;
    }

    /**
     * Determines if this rectangle contains the rectangle r
     * @param r
     * @returns {Boolean}
     */
    Rect.prototype.contains = function(r) {
        if (this.xMin > r.xMin) return false;
        if (this.yMin > r.yMin) return false;
        if (this.xMax < r.xMax) return false;
        if (this.yMax < r.yMax) return false;
        return true;
    };

    /**
     * Determines if this rectangle intersects the rectangle r
     * @param r
     * @returns {Boolean}
     */
    Rect.prototype.intersects = function(r) {
        if (this.xMax < r.xMin) return false;
        if (this.yMax < r.yMin) return false;
        if (this.xMin > r.xMax) return false;
        if (this.yMin > r.yMax) return false;
        return true;
    };

    /**
     * Finds the rectangle of intersection between two Rects.  Returns null
     * if no intersection
     * @param {type} r
     * @returns {Rect} or null
     */
    Rect.prototype.intersection = function(r) {
        var xMin = Math.max(this.xMin, r.xMin),
            yMin = Math.max(this.yMin, r.yMin),
            xMax = Math.min(this.xMax, r.xMax),
            yMax = Math.min(this.yMax, r.yMax);

        if (xMin >= xMax && yMin >= yMax) return null;

        return new Rect(xMin, yMin, xMax, yMax);
    };

    /**
     * Returns a new Rect that is the smallest that contains both this
     * Rect and the argument
     * @param {type} r
     * @returns {Rect}
     */
    Rect.prototype.expand = function(r) {
        var xMin = Math.min(this.xMin, r.xMin),
            yMin = Math.min(this.yMin, r.yMin),
            xMax = Math.max(this.xMax, r.xMax),
            yMax = Math.max(this.yMax, r.yMax);

        return new Rect(xMin, yMin, xMax, yMax);
    };

    /**
     * The perimeter of the rectangle
     * @returns {Number}
     */
    Rect.prototype.perimeter = function() {
        return 2 * (this.width() + this.height());
    };

    /**
     * Whether two Rects are identical (fields are the same using ===)
     * @param {type} r
     * @returns {Boolean}
     */
    Rect.prototype.equals = function(r) {
        return this.xMin === r.xMin &&
            this.yMin === r.yMin &&
            this.xMax === r.xMax &&
            this.yMax === r.yMax;
    };

    /**
     * The width of the rectangle
     * @returns {Number}
     */
    Rect.prototype.width = function() {
        return this.xMax - this.xMin;
    };

    /**
     * The height of the rectangle
     * @returns {Number}
     */
    Rect.prototype.height = function() {
        return this.yMax - this.yMin;
    };

    /**
     * The area of the rectangle
     * @returns {Number}
     */
    Rect.prototype.area = function() {
        return this.width() * this.height();
    };

    /**
     * Returns a String representation of a Rect in the format:
     * [(xMin, yMin), (xMax, yMax)]
     * @returns {String}
     */
    Rect.prototype.toString = function() {
        return "Rect(" + this.xMin + ", " + this.yMin + ", " +
            this.xMax + ", " + this.yMax + ")";
    };

    /**
     * Draws this Rect to the argument 2D canvas context using lines.  It is assumed that
     * any required transformation or formatting is done prior to this call.
     * @param {type} ctx
     * @returns {undefined}
     */
    Rect.prototype.draw = function(ctx) {
        ctx.strokeRect(this.xMin, this.yMin, this.width(), this.height());
    };

    /**
     * Draws this Rect to the argument 2D canvas context using a fill.  It is assumed that
     * any required transformation or formatting is done prior to this call.
     * @param {type} ctx
     * @returns {undefined}
     */
    Rect.prototype.drawFilled = function(ctx) {
        ctx.fillRect(this.xMin, this.yMin, this.width(), this.height());
    };

    return Rect;
});