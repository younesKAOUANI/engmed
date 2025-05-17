import React from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminSequenceCard({ sequences, handleSequenceChange, handleRemoveSequence }) {
    if (!sequences || sequences.length === 0) {
        return (
            <div className="p-4 border rounded">
                <p className="text-center text-gray-600">No sequences added yet</p>
            </div>
        )
    }
    return (
        <div>
            {sequences.map((sequence, index) => (
                <div key={sequence.id} className="mb-4 p-4 border rounded">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <Input
                            placeholder="Sequence Title"
                            value={sequence.title}
                            onChange={(e) => handleSequenceChange(index, 'title', e.target.value)}
                            disabled
                        />
                        <Input
                            type="number"
                            placeholder="Order"
                            value={sequence.order}
                            onChange={(e) => handleSequenceChange(index, 'order', parseInt(e.target.value))}
                            disabled
                        />
                    </div>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            onClick={() => handleRemoveSequence(index)}
                            className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md hover:scale-95"
                        >
                            Remove Sequence
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleRemoveSequence(index)}
                            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md hover:scale-95"
                        >
                            Edit Sequence
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}


