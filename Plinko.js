// Wrapper for Matter.js to draw Particles
function Plinko( x , y , r)
{  // this.body for the particle used for creating the circle Using Bodies of Matter.js
    var options = {
        isStatic : true,
        restitution : 1,
        friction : 0
    };
   
    this.body = Bodies.circle(x,y,r,options)  // Body Created as Circle
    this.r = r;                              //  Radius
    this.body.label = "plinko";
    World.add(world , this.body);           // Add to the World of matter.js
}

Plinko.prototype.change_position = function(offsetx) {
    this.body.position.x = offsetx;
}
Plinko.prototype.show = function() {
    fill( 0 , 0 , 255);      // To Fill The Circle with color
    stroke(0 , 0 , 255);   //  To Draw the circle
    var pos = this.body.position;
    // Get position ( x,y )
    push();
    translate(pos.x , pos.y);
    // Translate Given Particle position (x,y) to Ellipse Center Points(0,0)
    ellipse( 0 , 0 , this.r * 2);
    pop();
}