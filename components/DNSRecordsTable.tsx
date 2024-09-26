'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DNSRecord {
    id: string;
    type: string;
    host: string;
    answer: string;
    ttl: number;
    priority?: number;
}

interface DNSRecordsTableProps {
    data: DNSRecord[];
    domainName: string;
}

export default function DNSRecordsTable({ data , domainName }: DNSRecordsTableProps) {
    const [records, setRecords] = useState<DNSRecord[]>(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal state
    const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
    const [newRecord, setNewRecord] = useState<DNSRecord>({
        id: '',
        type: '',
        host: '',
        answer: '',
        ttl: 300,
    });

    // Filter records based on search term
    const filteredRecords = records.filter(record =>
        Object.values(record).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Calculate pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    const username = localStorage.getItem('username');
    const apiKey = localStorage.getItem('apiKey');
    // const provider = localStorage.getItem('dnsProvider');


    const handleAddRecord = () => {
        setIsAddModalOpen(true); // Open add record modal
    };

    const handleDeleteRecord = (id: string) => {
        setDeleteRecordId(id);
        setIsDeleteModalOpen(true); // Show delete confirmation modal
    };

    const confirmDeleteRecord = () => {
        if (deleteRecordId) {
            setRecords((prevRecords) => prevRecords.filter(record => record.id !== deleteRecordId));
            setIsDeleteModalOpen(false); // Close modal after deletion
            setDeleteRecordId(null); // Reset the delete record ID
        }
    };

    const handleSaveNewRecord = async () => {
        try {
            const response = await fetch('/api/addrecord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    apiKey: apiKey,
                    domainName: domainName,
                    host: newRecord.host,
                    type: newRecord.type,
                    answer: newRecord.answer,
                    ttl: newRecord.ttl
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setRecords([...records, { ...newRecord, id: data.id }]);
            setIsAddModalOpen(false);
            setNewRecord({ id: '', type: '', host: '', answer: '', ttl: 300 });
        } catch (error) {
            console.error('Failed to add record:', error);
            alert('Failed to add record: ' + (error as Error).message);
        }
    };


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button onClick={handleAddRecord} className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Record
                </Button>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select
                        value={recordsPerPage.toString()}
                        onValueChange={(value) => {
                            setRecordsPerPage(Number(value));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Records per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 per page</SelectItem>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Host</TableHead>
                            <TableHead>Answer</TableHead>
                            <TableHead>TTL</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentRecords.map((record) => (
                            <TableRow key={record.id}>
                                <TableCell>{record.type}</TableCell>
                                <TableCell>{record.host}</TableCell>
                                <TableCell style={{ wordWrap: 'break-word', maxWidth: '150px', whiteSpace: 'normal' }}>
                                    {record.answer}
                                </TableCell>
                                <TableCell>{record.ttl}</TableCell>
                                <TableCell>{record.priority || '-'}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteRecord(record.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} records
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this record? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDeleteRecord}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Record Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Input
                            placeholder="Type (A, CNAME, TXT, etc.)"
                            value={newRecord.type}
                            onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                        />
                        <Input
                            placeholder="Host"
                            value={newRecord.host}
                            onChange={(e) => setNewRecord({ ...newRecord, host: e.target.value })}
                        />
                        <Input
                            placeholder="Answer"
                            value={newRecord.answer}
                            onChange={(e) => setNewRecord({ ...newRecord, answer: e.target.value })}
                        />
                        <Input
                            type="number"
                            placeholder="TTL"
                            value={newRecord.ttl}
                            onChange={(e) => setNewRecord({ ...newRecord, ttl: Number(e.target.value) })}
                        />
                        <Input
                            type="number"
                            placeholder="Priority (Optional)"
                            value={newRecord.priority || ''}
                            onChange={(e) => setNewRecord({ ...newRecord, priority: Number(e.target.value) })}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="default" onClick={handleSaveNewRecord}>
                            Add Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
