import { NextResponse } from 'next/server'
import clientPromise from '../mongodb'

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db('supply_chain')
        const inventory = await db
            .collection('inventory')
            .find({})
            .toArray()

        return NextResponse.json(inventory)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 })
    }
}