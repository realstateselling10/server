import User from "../models/user.model.js";

export const contactUs = async (req, res) => {
  try {
    const { fullName, email, property, phoneNumber } = req.body;
    if (!fullName || !email || !property || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ error: "Invalid email format" });
    }
    const user = new User({
      fullName,
      email,
      property,
      phoneNumber,
    });
    await user.save();
    res.status(200).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//getting all users except admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({role : {$ne :"admin"}}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};