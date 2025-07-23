import { io } from "socket.io-client";
const socket = io("http://localhost:4000"); // jeśli backend na innym adresie, wpisz ten adres
export default socket;
