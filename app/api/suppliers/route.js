import { NextResponse } from 'next/server'
import clientPromise from '../mongodb'

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('supply_chain')
        const suppliers = await db
            .collection('suppliers')
            .find({})
            .toArray()

        return NextResponse.json(suppliers)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
    }
}