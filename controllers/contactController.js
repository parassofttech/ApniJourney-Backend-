const contactModel = require("../models/Contact");


const contactIns = async (req, res)=>{
    try {
       const {name, email, subject,message} = req.body;
       const userMod = new contactModel({ name,email,subject, message});
      await userMod.save()
      res.status(201)
      .json({
        message: "Message sent successfully",
        success : true
      })
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success : false
        })
    }
}

const viewMsg = async (req,res)=>{
    const messages = await contactModel.find().sort({ createdAt: -1 });
  res.json({ messages });
}


const deleteMsg =async (req,res)=>{
    await contactModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
}

module.exports = {contactIns,
    viewMsg,
    deleteMsg
}