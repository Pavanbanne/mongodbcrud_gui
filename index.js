const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Brand = require('./models/Brand')

const app = express()
const port = 3000

//mongo connection
mongoose.connect('mongodb+srv://pawan:12345@cluster0.zykhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(
    ()=> console.log('DB Connection successful') 
).catch(
    err=> console.err('Error connectind to Mongodb',err)
)

//middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public')) //for serving static files like css

//set ejs as view engine
app.set('view engine','ejs')

//routers
//home page - show all brands and the form for adding a new brand
app.get('/',async (req,res)=>{
    try{
       const brands = await Brand.find()
       res.render('index',{brands})
    }catch (err){
        console.log(err);
        res.status(500).send('server error')
        
    }
})

//add new brand
app.post('/add',async (req,res)=>{
    try{
        const newBrand = new Brand({
            name:req.body.name,
            description:req.body.description
        })
        await newBrand.save()
        res.redirect('/')
    }catch (err){
        console.log(err);
        res.status(500).send('Error add brand')
        
    }
})


//edit brand 
app.get('/edit/:id', async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).send('Brand not found');
        res.render('edit', { brand });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});


//update brand
app.post('/edit/:id', async (req, res) => {
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedBrand) return res.status(404).send('Brand not found');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error updating brand');
    }
});



//delete brand
app.post('/delete/:id',async(req,res)=>{
    try{
        await Brand.findByIdAndDelete(req.params.id)
        res.redirect('/')
    }catch (err){
        console.log(err);
        res.status(500).send('Error deleting brand')
        
    }
})

app.listen(port,()=>console.log("Server running on port http:localhost/3000"))