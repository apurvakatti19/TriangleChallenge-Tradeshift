//


var assert = require('assert');
describe('Triangle', function() 
{
  var Triangle = require('../public/processTriangle.js');
  console.log(Triangle)
 
  // Test One: Testing for Equilateral triangle
  it('should test if the given three values form an equilateral triangle', function()
  {
   
    const triobj1 = new Triangle(3,3,3);
    
    assert.equal("equilateral", triobj1.checkThetype());
  });
  // Test Two: Testing for Isoceles triangle
  it('should test if the given three values form an isoceles triangle', function()
  {
    const triobj2 = new Triangle(100,100,50);
    
    assert.equal("isoceles", triobj2.checkThetype());
  });

  it('should test if the given three values form an scalene triangle', function()
  {
    const triobj3 = new Triangle(7,13,14);
    
    
    assert.equal("scalene", triobj3.checkThetype());
  });

  it('should test if the given three values form not a triangle', function()
  {
    const triobj4 = new Triangle(1,100,1);
    
    // Our actual test: (3-4)*8 SHOULD EQUAL -8
    assert.equal("unknown", triobj4.checkThetype());
  });

  
});