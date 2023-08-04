import Influencer from "../models/influencers.js";
import generateP from "../utils/password-generator.js";
import qrcodeGenerator from "../utils/qr-code-generator";

export const createQR = async (req, res) => {
  try {
    const s_token = generateP();
    const qrcode_data =
      req.params.id + ";" + s_token + ";" + req.id + ";" + s_token;
    await Influencer.findByIdAndUpdate()
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
