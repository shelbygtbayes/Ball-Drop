// Wrapper for Matter.js to draw Particles
function Particle( x , y , r )
{  // this.body for the particle used for creating the circle Using Bodies of Matter.js
    
    const startRes = 0.5;
    const endRes = 0.55;
    const elasticity = Math.random() * (endRes - startRes) + startRes;
      
    var options = {
        isStatic : false,
        restitution : elasticity,
        friction : 0
    };
    this.hue = random(360) // Data member for Particle color
    x += random(-1,1);
    this.body = Bodies.circle(x , y , r , options); // Body Created as Circle
    this.body.label = "particle";     // A new property created n order to identify during collision with plinko
    this.r = r;                      //  Radius
    World.add(world , this.body);   // Add to the World of matter.js
}
Particle.prototype.InBucket = function() {
    var x = this.body.position.x;
    var y = this.body.position.y;
    let bucketWidth = width/10;
    if( y > height  && x >=0 && x < width )
    {
        return Math.floor(x/bucketWidth);
    }
    return -1;
}
Particle.prototype.show = function() {
    fill(this.hue , 255 , 255);      // To Fill The Circle with color
    stroke(this.hue , 255 , 255);   //  To Draw the circle
    var pos = this.body.position;
    push();
    // Get position ( x,y )
    translate(pos.x , pos.y);
    // Translate Given Particle position (x,y) to Ellipse Center Points(0,0)
    ellipse( 0 , 0 , this.r * 2);
    pop();
}