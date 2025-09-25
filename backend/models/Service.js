const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  s_ID:{
    
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  duration: {
    type: Number, // in minutes (e.g. oil change 30, body wash 45)
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  vehicleType: { 
        type: String,
        required: true,
        enum: ['Car', 'Van', 'SUV', 'Motorcycle', 'Three Wheel']
    }
});

// ekama vehicle type ekata ekama namin service type dekak hadanna bariwenna
// serviceSchema.index({ name: 1, vehicleType: 1 }, { unique: true });

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;