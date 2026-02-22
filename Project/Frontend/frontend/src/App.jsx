import ResumeChecker from './components/ResumeChecker'
import UserHistory from './components/UserHistory';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Navbar from './components/Navbar';
function App(){
    return(
     
        <Router>
            <div className="App">
                {/* Navbar stays visisble on every page */}
                 <Navbar/>
        <Routes>   
       <Route path="/" element={<ResumeChecker />} />
       <Route path="/history" element={<UserHistory/>}/>
        </Routes>
        </div> 
        </Router>
       
    );
}
export default App;