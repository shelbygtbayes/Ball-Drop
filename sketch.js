var Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Body = Matter.Body,
    Bodies = Matter.Bodies;
const rows = 17;
const cols = 17;
var canvas;
var engine , world , particles = [] , plinkos = [] , boundary = [] , buckets = [] ,  divider = [] , indicator , drop_val , isGenerate = 0;
var output_array = [] , position_array = [];
function newPlinko(x , y , plinko_radius) 
{
    return new Plinko(x , y , plinko_radius);
}
var ding;
// To Load the sound 
function preload(){
  ding = loadSound('ding.mp3')
}
function setup()
{
    engine = Engine.create();  // Create an Engine for Simulation
    world = engine.world;     //  Simulation World
    world.gravity.y = 1;     //   Normal Gravity
    //const canvas = document.getElementById('gameCanvas')
    function collision(event){
      // Since Matter.js provide the events of collision in pairs of object format
      var pairs = event.pairs;
      for(var e = 0 ; e < pairs.length ; e++)
      {
        var labelA = pairs[e].bodyA.label;
        var labelB = pairs[e].bodyB.label;
        if((labelA == "particle" && labelB == "plinko")||(labelB == "particle" && labelA == "plinko"))
        {
          ding.play();
        }
      }
      console.log(event);
    }

    Events.on(engine,'collisionStart',collision);
  // In world of engine , If 'collisionStart' happen then call collision() function

    canvas = createCanvas(windowWidth-80,windowHeight);  //   Draw Canvas 
    //canvas.position(width/2,13);
    colorMode(HSB);        //    Color Mode Used for color property
    var space = width/cols , plinko_radius = 9; 
    // Here width is by-default variable taken from window size()
    for(var r = 0 ; r < rows ; r++)   // Plinko's Pattern
    {
        for(var c = 0 ; c <= cols+1 ; c++)
        {
            var x =  c*space;
            if( r%2 == 0)
            {
                x += (space-20)/2;
            }
            var y = space + r*space;
            plinkos.push( newPlinko( x , y , plinko_radius) );
        }
    }
    
    indicator = newPlinko(16,16,16);
    // Boundary
    var left_wall = new Boundary(-1 , height/2 +  70, 1 ,height);
    boundary.push(left_wall);
   
    var right_wall = new Boundary(width+1 , height/2 + 70 , 1 , height);
    boundary.push(right_wall);        
    
    var ground = new Boundary(width , height+70, width , 1);
    boundary.push(ground);
    // BOTTOM BUCKETS
    const bucketWidth = width/10 , bucketHeight = 70;
    for(var b = 0 ; b < 10 ; b++)
    {
        var x = bucketWidth*b   ,y = height - bucketHeight , Bucket_color = '#30bdf2';
        var bucket = new Bucket(x , y , bucketWidth , bucketHeight , b , Bucket_color , 0);
        buckets.push(bucket); 
    // Divider
        x = bucketWidth * b;
        y = height - bucketHeight;
        var Div_color = 20;
        var divider_ = new Bucket(x , y , 2 , bucketHeight , -1 , Div_color , 0);
        divider.push(divider_); 
        
    }
}
function dropBalls(position, quantity) {
    particles = [];
    var ballCount = 0;   
    const startSize = 16;
    const endSize = 16;
    for (let i = 0; i < quantity; i++) 
    {
      ballCount++;
      if (ballCount > 785)
      {
        ballCount--;
        break;
      }
      const size = Math.random() * (endSize - startSize) + startSize;
      const dropX = position;
     
      position_array.push(dropX);
      newParticle(dropX , size , size );
    }
 
  }
   
function newParticle(x, y , radius)
{
    var p = new Particle(x, y, radius); // Create New Particle
    particles.push(p);
    
}
function particles_movement()
{
  for(var p = 0 ; p < particles.length ; p++)
  {
      
      particles[p].show() // Display / Show
     
      var bucketNo = particles[p].InBucket();
     
      if(bucketNo != -1)
      {
          World.remove(world , particles[p].body);
          particles.splice(p,1);
          buckets[bucketNo].update_score();
         
         if(position_array[p] >= 0) 
          output_array.push([position_array[p] , bucketNo]);
          p--;
      }

  }
}
function draw()
{
    
    background(0,0,0);      // Background color
    Engine.update(engine);

    indicator.change_position(mouseX);
    drop_val = mouseX;
    textSize(18);
    drop_position_display = text("Drop Position : "+ max(0,drop_val) , 670 , 50 );

    particles_movement();
     
    for(var p = 0 ; p < plinkos.length ; p++)
    {
        plinkos[p].show() // Display / Show
    }
    for( var b = 0 ; b < boundary.length ; b++)
    {
        boundary[b].show();
    }
    for( var b = 0 ; b < buckets.length ; b++)
    {
        buckets[b].show();
    }
    for( var b = 0 ; b < buckets.length ; b++)
    {
        divider[b].show();
    }
    indicator.show();
}
function mousePressed() {
      quantity = 1;
      dropBalls(mouseX, quantity);
      quantity = 0;
}
function dropBalls_equal_Space(position , quantity )
{
    var ballCount = 0;   
    const startSize = 16;
    const endSize = 16;
    for (let i = 0; i < quantity; i++) 
    {
      ballCount++;
      if (ballCount > 785) 
      {
        ballCount--;
        break;
      }
      const size = Math.random() * (endSize - startSize) + startSize;
      const dropX = position;
      position_array.push(dropX);
     
      newParticle(dropX , size , size );
    }
 
}
function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve,ms));
}
async function keyTyped(key)
{
  if(key == 'b')
  {
    const quantity = 100;
    const spacing = 100;
    
    var cnt = 0;
    var times = Math.floor(width / spacing);
    while(cnt < quantity)
    {
      for (let i = 1  ; i <  times && cnt < quantity; i++) {
        dropBalls_equal_Space(i*spacing, 1);
        cnt++;
      }
    }
  }
  else if(key == 's')
  {
    const quantity = 200;
    const spot = 765;
    dropBalls(spot, quantity);
  }
  else if(key == 'r')
  {
    for(let i = 0 ; i < 10 ; i++)
      buckets[i].score = 0;
    output_array = [];
  }
  else if(key == 'g')
  {
    await sleep(1000);
    dropBalls(mouseX, 100);
  }
  
    return false;
}
/*
var parameters = 1;
function runAnalysis() {
  const test_record_count = Math.floor(output_array.length * 0.20);
  
  const [test_data , train_data] = test_train_split( output_array  , test_record_count);
  _.range(1,15).forEach(k => {
  const accuracy = _.chain(test_data)
                    .filter( testPoint => knn(train_data , _.initial(testPoint) , k) === _.last(testPoint))
                    .size()
                    .divide(test_record_count)
                    .value()
  //const accuracy = (success / test_record_count)*100;
  console.log("When k = "+k+" Accuracy  : " + accuracy*100);
  });
console.log("Done !");
}

function knn(data , point , k)
{
             return _.chain(data)
                    .sortBy(row => distance( _.initial(row) , point))
                    .slice(0,k)
                    .map(row => row[parameters])  // Get the bucketlabel
                    .countBy()
                    .toPairs()
                    .sortBy(row => row[1])
                    .last()
                    .first()
                    .parseInt()
                    .value()  
 
}
// Data Split
function test_train_split(dataset , test_record_count)
{
  const shuffled = _.shuffle(dataset)
  //const shuffled = dataset;
  const test_set = _.slice(shuffled , 0 , test_record_count)
  const train_set = _.slice(shuffled , test_record_count)
  return [ test_set , train_set];
}
// KNN-distance
function distance(point1 , point2)
{
  return _.chain(point1)
          .zip(point2) // [ [] , [] , [] ]
          //.map(pair => (pair[0]-pair[1])**2)
          .map(([a,b]) => (a-b)**2)
          .sum()
          .value()**(0.5);
}
// Normalized
function min_max_Normalization(data , featuresCount)
{
  var cloned_data = _.cloneDeep(data);
  for(let f = 0 ; f < featuresCount ; f++)
  {
    const column = cloned_data.map(row => row[f]);
    const max = _.max(column);
    const min = _.min(column);
    for(let r = 0 ; r < cloned_data.length ; r++)
    {
      cloned_data[r][f] = (cloned_data[r][f] - min)/(max - min);
    }
  }
 
  return cloned_data;
}
*/