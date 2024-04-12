import React, { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Define types for Address and User objects
type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
};

type User = {
  id: number;
  name: string;
  address: Address;
};

const App: React.FC = () => {
  // Define state variables
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [options, setOptions] = useState<User[]>([]);

  // Function to sort users by name
  const sortUsersByName = useCallback((data: User[]): User[] => {
    return data.slice().sort((a: User, b: User) => {
      const [lastNameA, suffixA] = extractLastNameAndSuffix(a.name);
      const [lastNameB, suffixB] = extractLastNameAndSuffix(b.name);
      const lastNameComparison = lastNameA.localeCompare(lastNameB);
      if (lastNameComparison !== 0) {
        return lastNameComparison;
      }
      return suffixA.localeCompare(suffixB);
    });
  }, []);

  // Fetch users from API and sort them on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        const sortedData = sortUsersByName(data);
        setUsers(sortedData);
        setOptions(sortedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [sortUsersByName]);

  // Function to extract last name and suffix from user's full name
  const extractLastNameAndSuffix = (name: string): [string, string] => {
    const suffix = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
    const words = name.split(' ');
    let lastName = '';
    let suffixPart = '';
    if (suffix.includes(words[words.length - 1])) {
      suffixPart = words.pop() as string;
    }
    while (words.length > 0) {
      lastName = words.pop() as string + ' ' + lastName;
    }
    return [lastName.trim(), suffixPart];
  };

  // Handler function for input change in Autocomplete component
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.toLowerCase();
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(input));
    setOptions(filteredUsers);
  };

  // Function to format user name
  const formatUserName = (user: User): string => {
    const nameParts = user.name.split(' ');
    let title = '';
    if (nameParts.length > 1) {
      const firstWord = nameParts[0];
      const titleMatch = firstWord.match(/^(Mr\.|Mrs\.|Ms\.|Miss|Dr\.|Prof\.|Rev\.|Capt\.|Lt\.|Sir|Madam)$/);
      if (titleMatch) {
        title = titleMatch[0];
        nameParts.shift();
      }
    }
    let suffix = '';
    const lastWord = nameParts[nameParts.length - 1];
    const suffixMatch = lastWord.match(/(Jr\.|Sr\.|II|III|IV|V)$/);
    if (suffixMatch) {
      suffix = suffixMatch[0];
      nameParts.pop();
    }
    const lastName = nameParts.pop() || '';
    const lastNameWithoutSuffix = lastName.replace(/(Jr\.|Sr\.|II|III|IV|V)$/g, '').trim();
    const suffixRoman = lastName.replace(lastNameWithoutSuffix, '').trim();
    const firstName = nameParts.join(' ');
    let formattedName = `${lastNameWithoutSuffix}${suffix ? ` ${suffix}` : ''}, ${firstName}`;
    formattedName += suffixRoman;
    if (title) {
      formattedName = `${formattedName} (${title})`;
    }
    return formattedName.trim();
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <Autocomplete
        options={options}
        getOptionLabel={formatUserName}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Name"
            variant='outlined'
            onChange={handleInputChange}
          />
        )}
        onChange={(_, value) => setSelectedUser(value)}
      />
      {selectedUser && (
        <div style={{ paddingTop: 20, textAlign: 'center' }}>
          <h2>User Details:</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Street</TableCell>
                  <TableCell>Suite</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Zipcode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{formatUserName(selectedUser)}</TableCell>
                  <TableCell>{selectedUser.address.street}</TableCell>
                  <TableCell>{selectedUser.address.suite}</TableCell>
                  <TableCell>{selectedUser.address.city}</TableCell>
                  <TableCell>{selectedUser.address.zipcode}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default App;
