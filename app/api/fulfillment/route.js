import { NextResponse } from 'next/server'
// import clientPromise from '../mongodb'
import clientPromise from '../mongodb'

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('supply_chain')
        const orders = await db
            .collection('fulfillment')
            .find({})
            .sort({ lastUpdated: -1 })
            .limit(10)
            .toArray()

        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }
}