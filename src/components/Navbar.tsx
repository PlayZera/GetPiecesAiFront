import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg" style={{backgroundColor: '#646cff'}}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold" style={{color:"#f9f9f9"}}>Home</Link>
        <div className="flex gap-4">
          {/* <Link to="/login" className="hover:underline" style={{color:"#f9f9f9"}}>Login</Link> */}
          {/* <Link to="/dashboard" className="hover:underline" style={{color:"#f9f9f9"}}>Dashboard</Link> */}
        </div>
      </div>
    </nav>
  );
}
