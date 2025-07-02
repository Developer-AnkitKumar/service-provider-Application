const mongoose=require("mongoose");
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    url: String,
    public_id: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports=Category;