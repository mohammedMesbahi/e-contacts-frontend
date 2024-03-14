import * as React from 'react';
import {DataGrid, GridColDef, GridRowParams} from '@mui/x-data-grid';
import User from "../../Models/User";
import {Button} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios";
import proxy from "../../configs/config";
import {useEffect, useState} from "react";

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'login', headerName: 'login', width: 260},
    {
        field: 'verified',
        headerName: 'Verified',
        type: 'string',
        width: 90,
        valueFormatter: (params: any) => {
            return params.value === true ? 'Yes' : 'No';
        }
    }, {
        field: 'suspended',
        headerName: 'Suspended',
        type: 'string',
        width: 90,
        valueFormatter: (params: any) => {
            return params.value === true ? 'Yes' : 'No';
        }
    },
];




export default function UsersDataGrid() {
    const [users, setUsers] = React.useState<User[]>([]);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [message, setMessage] = React.useState<string>('');
    const [severity, setSeverity] = React.useState<"success" | "info" | "error">('success');
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filterUsers = (users: User[], searchTerm: string) => {
        return users.filter(user => {
            if (searchTerm && (user.login.startsWith(searchTerm))) {
                return user;
            } else if (!searchTerm) {
                return user;
            }
        });
    };

    useEffect(() => {
        setUsers(filterUsers(users, searchTerm));
    }, [searchTerm]);

    React.useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            const response = await axios.get(proxy.usersResource);
            setUsers(response.data);
        } catch (error: any) {
            setMessage(error.response.data || error.message);
            setSeverity('error');
            setOpen(true);
        }
    }
    const handleRowClick = (params: GridRowParams) => {
        setSelectedUser(params.row as User);
    }
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const verifyUser = async () => {
        try {
            const response = await axios.put(`${proxy.verifyUser}/${selectedUser?.id}`);
            setMessage("User " + selectedUser?.login + " verified successfully");
            setSeverity('success');
            setOpen(true);
            setUsers(users.map(user => {
                if (user.id === selectedUser?.id) {
                    user.verified = true;
                }
                return user;
            }));
        } catch (error: any) {
            setMessage(error.response.data || error.message);
            setSeverity('error');
            setOpen(true);
        } finally {
            setSelectedUser(null);
        }

    }
    const deleteUser = async () => {
        try {
            const response = await axios.delete(`${proxy.deleteUser}/${selectedUser?.id}`);
            setMessage("User " + selectedUser?.login + " deleted successfully");
            setSeverity('success');
            setOpen(true);
            setUsers(users.filter(user => user.id !== selectedUser?.id));
        } catch (error: any) {
            setMessage(error.response.data || error.message);
            setSeverity('error');
            setOpen(true);
        }
    }
    async function handelSuspension() {
        try {
            const url = selectedUser?.suspended ? `${proxy.unsuspendUser}/${selectedUser?.id}` : `${proxy.suspendUser}/${selectedUser?.id}`;
            const action = selectedUser?.suspended ? 'unsuspended' : 'suspended';
            const response = await axios.put(url);
            setMessage(`${selectedUser?.login} ${action} successfully`);
            setSeverity('success');
            setOpen(true);
            setUsers(users.map(user => {
                if (user.id === selectedUser?.id) {
                    user.suspended = !selectedUser?.suspended;
                }
                return user;
            }));
        } catch (error: any) {
            setMessage(error.response.data || error.message);
            setSeverity('error');
            setOpen(true);
        }
    }
    async function handleVerification() {
        try {
            const url = selectedUser?.verified ? `${proxy.disproveUser}/${selectedUser?.id}` : `${proxy.verifyUser}/${selectedUser?.id}`;
            const action = selectedUser?.verified ? 'disproved' : 'verified';
            const response = await axios.put(url);
            setMessage(`${selectedUser?.login} ${action} successfully`);
            setSeverity('success');
            setOpen(true);
            setUsers(users.map(user => {
                if (user.id === selectedUser?.id) {
                    user.verified = !selectedUser?.verified;
                }
                return user;
            }));
        } catch (error: any) {
            setMessage(error.response.data || error.message);
            setSeverity('error');
            setOpen(true);
        }
    }
    return (<>
            <input
                style={{width: '100%', padding: '10px', margin: '10px 0'}}
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <center>
                <div style={{height: 400, maxWidth: 600}}>
                    <DataGrid
                        rows={users}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 5},
                            },
                        }}

                        pageSizeOptions={[5, 10]}
                        onRowClick={handleRowClick}
                    />
                </div>
                <div className={'buttonsGroup'}>
                    <Button variant="contained"
                            onClick={handleVerification}
                            disabled={selectedUser == null}
                            color={selectedUser?.verified ? "info" : "success" }>
                        {selectedUser?.verified ? 'Disprove' : 'Verify'}
                    </Button>

                    <Button variant="outlined"
                            onClick={deleteUser}
                            disabled={selectedUser == null}
                            color="error">delete</Button>
                    <Button variant="contained"
                            onClick={handelSuspension}
                            disabled={selectedUser == null}
                            color="warning">
                        {selectedUser?.suspended ? 'unsuspend' : 'suspend'}
                    </Button>
                </div>
            </center>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}>
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>

    );
}
