import { NextResponse } from 'next/server';
import { connect } from '../../../../database/mongo.config';
import Sticker from '../../../../models/fetchImage';

export async function GET(request) {
  try {
    // Connect to the database
    await connect();

    // Parse query parameters from the request
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || '';
    const title = searchParams.get('title') || '';
    const tag = searchParams.get('tag') || '';
    const subtitle = searchParams.get('subtitle') || '';
    const pass = searchParams.get('pass') === 'true'; // Convert to boolean
    const discard = searchParams.get('discard') === 'true'; // Convert to boolean
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Initialize the query object
    let query = {};

    // Construct regex for folder filter
    let folderRegex = '';

    // Build the regex based on the filters provided
    if (language) {
      folderRegex += `${language}/`; // Ensure the language is part of the folder path
    }
    if (title) {
      folderRegex += `.*${title.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}`; // Escape special characters
    }
    if (tag) {
      folderRegex += `.*${tag.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}`; // Escape special characters
    }
    if (subtitle) {
      folderRegex += `.*${subtitle.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")}`; // Escape special characters
    }

    // Apply regex if folderRegex is not empty
    if (folderRegex) {
      query.folder = new RegExp(folderRegex, 'i'); // Case-insensitive search
    }

    // Apply pass and discard filters
    if (pass) query.pass = true;
    if (discard) query.discard = true;

    // Calculate pagination options
    const skip = (page - 1) * limit;

    // Fetch the data from the database with pagination
    const [stickers, total] = await Promise.all([
      Sticker.find(query).skip(skip).limit(limit),
      Sticker.countDocuments(query) // Total count for pagination info
    ]);

    // Return the results as a JSON response with pagination info
    return NextResponse.json({
      data: stickers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
