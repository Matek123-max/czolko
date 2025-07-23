import { io } from "socket.io-client";
const socket = io("https://czolko-3.onrender.com"); // <-- tu twój backend!
export default socket;
