import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import useLocalStorage from '../hooks/useLocalStorage';
import type { InventoryItem } from '../types/inventory';

export default function Inventory() {
   const [items, setItems] = useLocalStorage<InventoryItem[]>('inventory', []);
   const [name, setName] = useState('');
   const [quantity, setQuantity] = useState(1);

   const addItem = () => {
      const trimmed = name.trim();
      if (!trimmed) return;

      setItems((prev) => [
         ...prev,
         {
            id: uuid(),
            name: trimmed,
            quantity,
         },
      ]);

      setName('');
      setQuantity(1);
   };

   return (
      <div style={{ padding: 20 }}>
         <h2>Inventory</h2>

         <label htmlFor="item-name">Item Name:</label>
         <input
            type="text"
            id="item-name"
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
         />

         <label htmlFor="quantity">Quantity</label>
         <input
            type="number"
            id="quantity"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
         />

         <button onClick={addItem}>Add</button>

         <ul>
            {items.map((item) => (
               <li key={item.id}>
                  {item.name} - {item.quantity}
               </li>
            ))}
         </ul>
      </div>
   );
}
