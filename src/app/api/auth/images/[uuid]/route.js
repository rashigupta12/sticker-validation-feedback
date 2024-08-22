// path src/app/api/auth/images/[uuid]/route.js

import { connect } from "../../../../../database/mongo.config";
import Sticker from "../../../../../models/fetchImage"; // Adjust the path if necessary

export async function PUT(req) {
  const url = new URL(req.url);
  const uuid = url.pathname.split("/").pop(); // Extract UUID from URL

  if (!uuid) {
    return new Response(JSON.stringify({ error: "UUID is required" }), {
      status: 400,
    });
  }

  try {
    await connect();
  
    const body = await req.json();
    console.log(body);
    if (!body) {
      return new Response(JSON.stringify({ error: "Request body is required" }), {
        status: 400,
      });
    }
  
    const updatedSticker = await Sticker.findOneAndUpdate(
      { uuid: uuid },
      { $set: body },
      { new: true, runValidators: true }
    );
    console.log(updatedSticker);
  
    if (!updatedSticker) {
     
      return new Response(JSON.stringify({ error: "Sticker not found" }), {
        status: 404,
      });
    }
  
    return new Response(JSON.stringify(updatedSticker), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update sticker" }), {
      status: 500,
    });
  }
  
}
