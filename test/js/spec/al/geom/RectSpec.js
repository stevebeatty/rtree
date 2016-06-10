define(['al/geom/Rect'], function(Rect) {
    describe("geom.Rect", function() {
        
        var r0, r1, r2, r3, r4;
        
        beforeEach(function() {
            r0 = new Rect(0, 0, 1, 1);
            r1 = new Rect(0.25, 0.25, 0.75, 0.75);
            r2 = new Rect(0.5, 0.25, 0.85, 0.5);
            r3 = new Rect(0.1, 0, 0.2, 0.1);
            r4 = new Rect(0.2, 0.3, 0.6, 0.7);
        });
        
        /**
         * Rect
         */
        describe("Constructor", function() {

            it("should set member varibles correctly - r0", function() {
                expect(r0.xMin).toBe(0);
                expect(r0.xMax).toBe(1);
                expect(r0.yMin).toBe(0);
                expect(r0.yMax).toBe(1);
            });
            
            it("should set member varibles correctly - r1", function() {
                expect(r1.xMin).toBe(0.25);
                expect(r1.xMax).toBe(0.75);
                expect(r1.yMin).toBe(0.25);
                expect(r1.yMax).toBe(0.75);
            });

        });
        
        /**
         * height
         */
        describe("height", function() {

            it("should have correct heights", function() {
                expect(r0.height()).toBe(1);
                expect(r1.height()).toBe(0.5);
                expect(r2.height()).toBe(0.25);
                expect(r3.height()).toBe(0.1);
            });

        });
        
        /**
         * width
         */
        describe("width", function() {

            it("should have correct widths", function() {
                expect(r0.width()).toBe(1);
                expect(r1.width()).toBe(0.5);
                expect(r2.width()).toBe(0.35);
                expect(r3.width()).toBe(0.1);
            });

        });
        
        /**
         * contains
         */
        describe("contains", function() {

            it("r0 contains r1", function() {
                expect(r0.contains(r1)).toBe(true);
            });
            
            it("r0 contains r0", function() {
                expect(r0.contains(r0)).toBe(true);
            });
            
            it("r0 contains r2", function() {
                expect(r0.contains(r2)).toBe(true);
            });
            
            it("r1 does not contain r0", function() {
                expect(r1.contains(r0)).toBe(false);
            });
            
            it("r1 does not contain r2", function() {
                expect(r1.contains(r2)).toBe(false);
            });
            
            it("r1 contains r1", function() {
                expect(r1.contains(r1)).toBe(true);
            });
            
            it("r2 contains r2", function() {
                expect(r2.contains(r2)).toBe(true);
            });
            
            it("r2 does not contain r0", function() {
                expect(r2.contains(r0)).toBe(false);
            });
            
            it("r2 does not contain r1", function() {
                expect(r2.contains(r1)).toBe(false);
            });

        });
        
        /**
         * intersects
         */
        describe("intersects", function() {

            it("r0 intersects r1", function() {
                expect(r0.intersects(r1)).toBe(true);
            });
            
            it("r0 intersects r0", function() {
                expect(r0.intersects(r0)).toBe(true);
            });
            
            it("r0 intersects r2", function() {
                expect(r0.intersects(r2)).toBe(true);
            });
            
            it("r1 intersects r0", function() {
                expect(r1.intersects(r0)).toBe(true);
            });
            
            it("r1 intersects r2", function() {
                expect(r1.intersects(r2)).toBe(true);
            });
            
            it("r1 intersects r1", function() {
                expect(r1.intersects(r1)).toBe(true);
            });
            
            it("r2 intersects r2", function() {
                expect(r2.intersects(r2)).toBe(true);
            });
            
            it("r2 intersects r0", function() {
                expect(r2.intersects(r0)).toBe(true);
            });
            
            it("r2 intersects r1", function() {
                expect(r2.intersects(r1)).toBe(true);
            });
            
            it("r3 intersects r0", function() {
                expect(r3.intersects(r0)).toBe(true);
            });
            
            it("r3 does not intersect r1", function() {
                expect(r3.intersects(r1)).toBe(false);
            });
            
            it("r3 does not intersect r2", function() {
                expect(r3.intersects(r2)).toBe(false);
            });
            
            it("r3 intersects r3", function() {
                expect(r3.intersects(r3)).toBe(true);
            });

        });
        
        /**
         * equals
         */
        describe("equals", function() {

            it("r0 equals r0", function() {
                expect(r0.equals(r0)).toBe(true);
            });
            
            it("r0 !equals r1", function() {
                expect(r0.equals(r1)).toBe(false);
            });
            
            it("r0 !equals r2", function() {
                expect(r0.equals(r2)).toBe(false);
            });
            
            it("r0 !equals r3", function() {
                expect(r0.equals(r3)).toBe(false);
            });
            
            it("r0 equals new Rect(0, 0, 1, 1)", function() {
                expect(r0.equals(new Rect(0, 0, 1, 1))).toBe(true);
            });
        });
        
        /**
         * intersection
         */
        describe("intersection", function() {

            it("r0 intersects all of r1", function() {
                expect(new Rect(0.25, 0.25, 0.75, 0.75).equals(r0.intersection(r1))).toBe(true);
            });
            
            it("all of r1 intersects r0", function() {
                expect(r1.equals(r1.intersection(r0))).toBe(true);
            });
            
            it("r1 intersects most of r2", function() {
                expect(new Rect(0.5, 0.25, 0.75, 0.5).equals(r1.intersection(r2))).toBe(true);
            });
            
            it("r2 intersects most of r1", function() {
                expect(new Rect(0.5, 0.25, 0.75, 0.5).equals(r2.intersection(r1))).toBe(true);
            });
            
            it("r0 intersects all of r3", function() {
                expect(r3.equals(r0.intersection(r3))).toBe(true);
            });
            
            it("r3 intersects r0 with size r3", function() {
                expect(r3.equals(r3.intersection(r0))).toBe(true);
            });
            
            it("r1 intersects none of r3", function() {
                expect(r1.intersection(r3)).toBeNull();
            });
            
            it("r3 intersects none of r1", function() {
                expect(r3.intersection(r1)).toBeNull();
            });
            
            it("r2 intersects none of r3", function() {
                expect(r2.intersection(r3)).toBeNull();
            });
            
            it("r3 intersects none of r2", function() {
                expect(r3.intersection(r2)).toBeNull();
            });
            
            it("r3 intersects all of r3", function() {
                expect(r3.equals(r3.intersection(r3))).toBe(true);
            });
            
            it("r3 intersects a degenerate Rect that is a line", function() {
                expect(new Rect(0.1, 0.1, 0.2, 0.1).equals(r3.intersection(new Rect(0.1, 0.1, 0.3, 0.1)))).toBe(true);
            });

        });
        
        
        /**
         * expand
         */
        describe("expand", function() {
            it("r0 expand r1 = r0", function() {
                expect(r0.equals(r0.expand(r1))).toBe(true);
            });
            
            it("r1 expand r0 = r0", function() {
                expect(r0.equals(r1.expand(r0))).toBe(true);
            });
            
            it("r1 expand r2 = Rect(0.25, 0.25, 0.85, 0.75)", function() {
                expect(new Rect(0.25, 0.25, 0.85, 0.75).equals(r1.expand(r2))).toBe(true);
            });
            
            it("r2 expand r1 = Rect(0.25, 0.25, 0.85, 0.75)", function() {
                expect(new Rect(0.25, 0.25, 0.85, 0.75).equals(r2.expand(r1))).toBe(true);
            });
            
            it("r0 expand r3 = r0", function() {
                expect(r0.equals(r0.expand(r3))).toBe(true);
            });
            
            it("r3 expand r0 = r0", function() {
                expect(r0.equals(r3.expand(r0))).toBe(true);
            });
        });
        
        
        /**
         * perimeter
         */
        describe("perimeter", function() {
            it("the perimeter of r0 is 4", function() {
                expect(r0.perimeter()).toBe(4);
            });
            
            it("the perimeter of r1 is 2", function() {
                expect(r1.perimeter()).toBe(2);
            });
            
            it("the perimeter of r2 is 1.2", function() {
                expect(r2.perimeter()).toBe(1.2);
            });
            
            it("the perimeter of r3 is 0.4", function() {
                expect(r3.perimeter()).toBe(0.4);
            });
        });
        
        /**
         * area
         */
        describe("area", function() {
            it("the area of r0 is 1", function() {
                expect(r0.area()).toBeCloseTo(1, 8);
            });
            
            it("the area of r1 is 0.25", function() {
                expect(r1.area()).toBeCloseTo(0.25, 8);
            });
            
            it("the area of r2 is 0.0875", function() {
                expect(r2.area()).toBeCloseTo(0.0875, 8);
            });
            
            it("the area of r3 is 0.01", function() {
                expect(r3.area()).toBeCloseTo(0.01, 8);
            });
        });
        
    });
});