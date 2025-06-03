import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// server-side endpoint for retrieving database information
export async function GET() {
  const client = await pool.connect();

  // try to get quotes and update visitor count
  try {
    // start query
    await client.query('BEGIN');

    // read and lock row
    const select_result = await client.query(
      'SELECT count FROM visits WHERE id = 1 FOR UPDATE'
    );

    // update or retrieve count
    let count;
    if (select_result.rowCount === 0) {
      await client.query(
        'INSERT INTO visits(id, count) VALUES(1, 0)'
      );
      count = 0;
    } else {
      count = select_result.rows[0].count;
    }

    // increment count
    count += 1;
    await client.query(
      'UPDATE visits SET count = $1 WHERE id = 1',
      [count]
    );

    // cycle the quotes
    const quote_result = await client.query(
      'SELECT quote, author FROM quotes OFFSET $1 LIMIT 1',
      [count % 499708]
    );

    const { quote, author } = quote_result.rows[0] || {
      quote: 'No quotes found.',
      author: '',
    };

    // submit the queries to pg
    await client.query('COMMIT');

    return NextResponse.json({ count, quote, author });

  } catch (error) {
    // rollback pg on error
    await client.query('ROLLBACK');

    console.error('Error in /api/visit:', error);

    // return error message
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  } finally {
    // free client
    client.release();
  }
}
