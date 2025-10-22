import React, { useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function RaspberryPayApp() {
  const [ip, setIp] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchUsers = async () => {
    if (!ip) {
        alert('Insira o endereço IP do Raspberry Pi.');
        return;
    }
    try {
      const res = await fetch(`http://${ip}:3000/api/users`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const formattedUsers = data.map(u => ({ ...u, label: `${u.user_name} (${u.card_number})`, value: u }));
      setUsers(formattedUsers);
    } catch (err) {
      console.error("Fetch error:", err);
      alert('Erro ao buscar usuários. Verifique o IP, a conexão e se a API está rodando.');
    }
  };

  const fetchTransactions = async () => {
    if (!selectedUser || !ip) {
        alert('Selecione um usuário e insira o IP.');
        return;
    }
    try {
      let url = `http://${ip}:3000/api/transactions/${selectedUser.card_number}`;
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString().slice(0, 10));
      if (endDate) params.append('endDate', endDate.toISOString().slice(0, 10));
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await fetch(url);
       if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTransactions(data);
    } catch (err)      {
      console.error("Fetch error:", err);
      alert('Erro ao buscar transações.');
    }
  };
  
  const formatDate = (rowData) => {
    const date = new Date(rowData.timestamp);
    const pad = (num) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  }

  const formatCurrency = (rowData) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rowData.amount);
  }

  const leftContents = (
    <div className="flex align-items-center gap-3">
      <h2 className="m-0">RaspberryPay</h2>
      <InputText
        placeholder="Endereço IP do Raspberry Pi"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        style={{ width: '300px' }}
      />
      <Button label="Buscar Usuários" icon="pi pi-search" onClick={fetchUsers} />
    </div>
  );

  return (
    <div className="card p-4">
      <Toolbar left={leftContents} />

      <div className="p-card p-4 mt-4">
        <div className="flex flex-wrap align-items-center gap-3">
          <Dropdown
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.value)}
            options={users}
            optionLabel="label"
            placeholder="Selecione o usuário"
            style={{ minWidth: '250px' }}
            filter
            showClear
          />
          <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} placeholder="Data inicial" showIcon dateFormat="yy-mm-dd" />
          <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} placeholder="Data final" showIcon dateFormat="yy-mm-dd" />
          <Button label="Pesquisar Transações" icon="pi pi-list" onClick={fetchTransactions} disabled={!selectedUser} />
        </div>
      </div>

      <div className="p-card mt-4">
        <DataTable value={transactions} scrollable scrollHeight="400px" paginator rows={10} emptyMessage="Nenhuma transação encontrada.">
          <Column field="transaction_id" header="ID" sortable style={{width: '10%'}}></Column>
          <Column field="amount" header="Valor" sortable body={formatCurrency} style={{width: '20%'}}></Column>
          <Column field="timestamp" header="Data/Hora" sortable body={formatDate} style={{width: '70%'}}></Column>
        </DataTable>
      </div>
    </div>
  );
}