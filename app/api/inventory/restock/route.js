import { NextResponse } from 'next/server'
import clientPromise from '../../mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request) {
    try {
        const { productId } = await request.json()
        const client = await clientPromise
        const db = client.db('supply_chain')

        await db.collection('inventory').updateOne(
            { _id: new ObjectId(productId) },
            { $inc: { currentStock: 50 } } // Increment stock by 50 units
        )

        return NextResponse.json({ message: 'Restock successful' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to restock item' }, { status: 500 })
    }
}
