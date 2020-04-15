function Bucket(x , y , w , h , ID , color , sc)
{
    var options = {
        id : ID,
        isStatic : true,
        isSensor: true,
    };
    this.body = Bodies.rectangle(x , y , w , h , options);
    this.w = w;
    this.color = color;
    this.score = sc;
    this.h = h;
    this.ID = ID;
    World.add(world , this.body);
}
Bucket.prototype.update_score = function() {
    if(this.ID >= 0)
        {
            this.score = this.score + 1;
        }
    }
Bucket.prototype.show = function() {
    fill(this.color);
    stroke(this.color);
    var pos = this.body.position;
    push(); 
    translate(pos.x , pos.y);
    rect( 0 , 0 ,this.w , this.h);
    if(this.ID >=0 )
    {
        textSize(20);
        fill(255);
        noStroke();    
        text(this.score , 70 , 30);  
        textSize(15);
        fill(0);
        stroke(0);    
        text("Bucket "+this.ID , 50 , 60); 
    }
    pop(); 
}