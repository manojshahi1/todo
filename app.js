const cool = require('cool-ascii-faces');
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://Admin_manojshahi123:test123@myapp.pjtwu.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose schema
 const itemsSchema = {
  name: String,
}

const Item = mongoose.model("Item",itemsSchema)
const item1 = new Item ({
  name:"welcome this is item 1",
},);
const item2 = new Item ({
  name:"welcome this is item 2",
},);
const item3 = new Item ({
  name:"welcome this is item 3",
},);
const defaultItems =[item1,item2,item3];
const listSchema ={
  name:String,
  items:[itemsSchema]
};
const List = mongoose.model("List",listSchema);
app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){
    if (foundItems.length === 0){
      Item.insertMany(defaultItems , function(err){
        if(err){
          console.log(err);
        }else{
          console.log("sucessfully inserted");
        }
      })
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }



});
});

app.post("/", function(req, res){

const itemName =req.body.newItem;
const item = new Item({
  name:itemName
});
item.save();
res.redirect("/")
});
app.post("/delete", function(req, res){
const checkeditemid = req.body.checkbox;
Item.findByIdAndRemove(checkeditemid ,function(err){
  if(!err){
    console.log("sucessfully deleted item");
  }
});
res.redirect("/")
});

app.get("/:customListName",function(req,res){
const cln = req.params.customListName;
List.findOne({name:cln},function(err ,foundlist){
  if( !err){
  if(!foundlist){
    //creating a new list in database
    const list = new List({
      name:cln,
      items:defaultItems,
    });
    list.save();
  res.redirect("/"+cln);
  } else{
    res.render("list", {listTitle: foundlist.name, newListItems: foundlist.items});
  }
  }
})

});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
