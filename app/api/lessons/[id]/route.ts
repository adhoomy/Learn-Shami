import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    
    // Validate lesson ID (should be a number)
    if (!/^\d+$/.test(lessonId)) {
      return NextResponse.json(
        { error: 'Invalid lesson ID. Must be a number.' },
        { status: 400 }
      );
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), 'lessons', `lesson${lessonId}_greetings.csv`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: `Lesson ${lessonId} not found.` },
        { status: 404 }
      );
    }

    // Read the CSV file
    const csvContent = await fs.readFile(filePath, 'utf-8');
    
    // Parse CSV to JSON using Papa Parse
    const result = Papa.parse(csvContent, {
      header: true, // Use first row as headers
      skipEmptyLines: true, // Skip empty lines
      transform: (value, field) => {
        // Convert empty strings to null for optional fields
        if (value === '') return null;
        return value;
      }
    });

    // Check for parsing errors
    if (result.errors.length > 0) {
      console.error('CSV parsing errors:', result.errors);
      return NextResponse.json(
        { error: 'Error parsing CSV file.' },
        { status: 500 }
      );
    }

    // Return the parsed JSON data
    return NextResponse.json({
      lessonId: parseInt(lessonId),
      totalItems: result.data.length,
      data: result.data
    });

  } catch (error) {
    console.error('Error loading lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
