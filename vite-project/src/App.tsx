import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [options, setOptions] = useState<User[]>([]);

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
  }, []);

  const sortUsersByName = (data: User[]): User[] => {
    return data.slice().sort((a: User, b: User) => {
      const [lastNameA, suffixA] = extractLastNameAndSuffix(a.name);
      const [lastNameB, suffixB] = extractLastNameAndSuffix(b.name);
      const lastNameComparison = lastNameA.localeCompare(lastNameB);
      if (lastNameComparison !== 0) {
        return lastNameComparison;
      }
      return suffixA.localeCompare(suffixB);
    });
  };

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.toLowerCase();
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(input));
    setOptions(filteredUsers);
  };

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




// import React, { useState, useEffect } from 'react';
// import { Autocomplete, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// interface User {
//   id: number;
//   name: string;
//   address: {
//     street: string;
//     suite: string;
//     city: string;
//     zipcode: string;
//   };
// }

// const App: React.FC = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [options, setOptions] = useState<User[]>([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('https://jsonplaceholder.typicode.com/users');
//         const data: User[] = await response.json();
//         const sortedData = data.sort((a: User, b: User) => {
//           // Function to remove suffixes from names
//           const extractLastNameAndSuffix = (name: string) => {
//             const suffix = ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'];
//             const words = name.split(' ');
//             const lastName = [];
//             let suffixPart: string = '';

//             // Check if the last word is a suffix
//             if (suffix.includes(words[words.length - 1])) {
//               suffixPart = words.pop() as string;
//             }
//             // Combine the remaining words as last name
//             while (words.length > 0) {
//               lastName.unshift(words.pop() as string);
//             }
//             return [lastName.join(' '), suffixPart];
//           };

//           //Extract last name and suffix
//           const [lastNameA, suffixA] = extractLastNameAndSuffix(a.name);
//           const [lastNameB, suffixB] = extractLastNameAndSuffix(b.name);

//           // Compare last names first
//           const lastNameComparison = lastNameA.localeCompare(lastNameB);
//           if (lastNameComparison !== 0) {
//             return lastNameComparison;
//           }

//           // If last names are the same, compare suffixes
//           return suffixA.localeCompare(suffixB);
//         });
//         setUsers(sortedData)
//         setOptions(sortedData)
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };
//     fetchUsers();
//   }, []);

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const input = event.target.value;
//     const filteredUsers = users.filter(user => 
//       user.name.toLowerCase().includes(input.toLowerCase())
//     );
//     setOptions(filteredUsers);
//   };

//   const formatUserName = (user: User): string => {
//     const nameParts = user.name.split(' ');

//     // Extract title if it appears at the beginning of the name
//     let title = '';
//     if (nameParts.length > 1) {
//       const firstWord = nameParts[0];
//       const titleMatch = firstWord.match(/^(Mr\.|Mrs\.|Ms\.|Miss|Dr\.|Prof\.|Rev\.|Capt\.|Lt\.|Sir|Madam)$/);
//       if (titleMatch) {
//         title = titleMatch[0];
//         nameParts.shift(); // Remove title from name parts
//       }
//     }

//     // Extract suffix if it appears at the end of the name
//     let suffix = '';
//     const lastWord = nameParts[nameParts.length - 1];
//     const suffixMatch = lastWord.match(/(Jr\.|Sr\.|II|III|IV|V)$/);
//     if (suffixMatch) {
//       suffix = suffixMatch[0];
//       nameParts.pop(); // Remove suffix from name parts
//     }

//     // Extract last name
//     const lastName = nameParts.pop() || '';

//     // Handle Roman numeral suffixes
//     const lastNameWithoutSuffix = lastName.replace(/(Jr\.|Sr\.|II|III|IV|V)$/g, '').trim();
//     const suffixRoman = lastName.replace(lastNameWithoutSuffix, '').trim();

//     // Combine first name and remaining parts
//     const firstName = nameParts.join(' ');

//     // Construct formatted name
//     let formattedName = `${lastNameWithoutSuffix}${suffix ? ` ${suffix}` : ''}, ${firstName}`;

//     // Append Roman numeral suffix if present
//     formattedName += suffixRoman;

//     // Append title if present
//     if (title) {
//       formattedName = `${formattedName} (${title})`;
//     }

//     return formattedName.trim();
//   };

//   return (
//     <div style={{ paddingTop: 20 }}>
//       <Autocomplete
//         options={options}
//         getOptionLabel={(option) => formatUserName(option)}
//         renderInput={(params) => (
//           <TextField 
//             {...params} 
//             label="Name"
//             variant='outlined'
//             onChange={handleInputChange}
//           />
//         )}
//         onChange={(_, value) => setSelectedUser(value)}
//       />
//       {selectedUser && (
//         <div style={{ paddingTop: 20, textAlign: 'center' }}>
//           <h2>User Details:</h2>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Street</TableCell>
//                   <TableCell>Suite</TableCell>
//                   <TableCell>City</TableCell>
//                   <TableCell>Zipcode</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 <TableRow>
//                   <TableCell>{formatUserName(selectedUser)}</TableCell>
//                   <TableCell>{selectedUser.address.street}</TableCell>
//                   <TableCell>{selectedUser.address.suite}</TableCell>
//                   <TableCell>{selectedUser.address.city}</TableCell>
//                   <TableCell>{selectedUser.address.zipcode}</TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
