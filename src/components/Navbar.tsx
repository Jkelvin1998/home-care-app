import { Link } from 'react-router-dom';

export default function Navbar() {
   return (
      <nav style={{ padding: 12, background: '#222' }}>
         <Link to={'/'} style={{ color: '#fff', marginRight: 12 }}>
            Dashboard
         </Link>
         <Link to={'/inventory'} style={{ color: '#fff', marginRight: 12 }}>
            Inventory
         </Link>
         <Link to={'/health-record'} style={{ color: '#fff' }}>
            Health
         </Link>
      </nav>
   );
}
