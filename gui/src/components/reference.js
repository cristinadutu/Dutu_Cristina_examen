import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

const SERVER = "http://localhost:8080/api";

function Reference() {
  const {articleId} = useParams(); 
  const navigateTo = useNavigate();
  const [displayBasic, setDisplayBasic] = useState(false);
 
  const [references, setReferences] = useState([]);
  const [title, setTile] = useState("");
  const [date, setDate] = useState("");
  const [listOfAuthors, setListOfAuthors] = useState("");

  //OPERATII CRUD
  const getReferences = async () => {
    try {

      const response = await fetch(`${SERVER}/articles/${articleId}/references`);
      const data = await response.json();

      setReferences(data);
    } catch (err) {
      console.warn(err);
    }
  };


  const deleteReference= async(row) => {
    try {
      const response = await fetch(`${SERVER}/articles/${articleId}/references/${row.id}`, {
          method: 'DELETE'
      });
      if(!response.ok) {
          throw response
      }

      getReferences();
    } catch (err) {
      console.warn(err);
    }
  }

 
  const addReference = async() => {
    if(!title || !date ) {
      alert('Va rugam sa completati toate campurile!')
      return;
    }
    if(title.length< 5){
        alert('Titlul trebuie sa aiba cel putin 5 caractere!')
        return;
    }
    try {
      const response = await fetch(`${SERVER}/articles/${articleId}/references`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            date,
            listOfAuthors
          })
      });
      if(!response.ok) {
          throw response
      }
      getReferences();
      setTile('');
      setDate('');
      setListOfAuthors('');
    } catch (err) {
      console.warn(err);
    }
  }


  const updateReference = async(data) => {
    try {
        
      const response = await fetch(`${SERVER}/articles/${articleId}/references/${data.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if(!response.ok) {
          throw response
      }

      getReferences();
    } catch (err) {
      console.warn(err);
    }
  }

  
  const[showUpdateDialog, setShowUpdateDialog] = useState(false)
  const[selectedTitle, setselectedTitle]=useState('');
  const[selectedDate, setselectedDate]=useState('');
  const[selectedListOfAuthors, setSelectedListOfAuthors]=useState('');
  const[selectedId, setselectedId]=useState('');

  const onShow=()=>{
    setShowUpdateDialog(true);
}

const onAdd=()=>{
    if(!selectedTitle || !selectedDate || !selectedListOfAuthors ) {
        alert('Va rugam sa completati toate campurile!')
        return;
      }
     else if(selectedTitle.length< 5){
          alert('Titlul trebuie sa aiba cel putin 5 caractere!')
          return;
      }
    setShowUpdateDialog(false);
    updateReference({id:selectedId, title:selectedTitle,date:selectedDate, listOfAuthors:selectedListOfAuthors});
}


const onHide=()=>{
    setShowUpdateDialog(false);
}


const dialogAction = () => {
    return (
        <div>
            <Button label="Anulare"  onClick={() => onHide()} className="p-button-danger p-1 w-3" />
            <Button label='Confirmare' className="p-button-success p-1 w-3" onClick={() => onAdd()}  />
        </div>
    );
}


  const columnForDelete = (rowData) => {
    return <Button onClick={() => deleteReference(rowData)} icon="pi pi-minus" className="p-button-rounded p-button-danger p-button-text" tooltip="Stergere referinta"/>
  }


  const columnForUpdate = (rowData) => {
    return(
        <Button icon="pi pi-check" onClick={() => {onShow(); setselectedId(rowData.id)}}  className=" p-button-info p-button-text" tooltip="Modificare" />
    )
  }


  useEffect(() => {
    getReferences();
  }, []);





  return(
      <div>
          <h2 style={{ borderBottom: "solid 1px black", padding: "10px",color:"blue" }}>
        Referintele articolului selectat
      </h2>
      
      <DataTable value={references} responsiveLayout="scroll"  >
        <Column field="id" header="Id" style={{ width: '10%' }}></Column>
        <Column field="title" header="Titlu" style={{ width: '30%' }}></Column>
        <Column field="date" header="Data" style={{ width: '20%' }}  ></Column>
        <Column field="listOfAuthors" header="Autori" style={{ width: '20%' }}  ></Column>
        <Column body={columnForDelete} style={{ width: '10%' }}></Column> 
        <Column body={columnForUpdate} style={{ width: '10%' }}></Column> 
      </DataTable>

      <Dialog header='Doresti sa modifici referinta?' visible={showUpdateDialog} style={{ width: '30vw' }} footer={dialogAction()} onHide={() => onHide()} onShow={()=>onShow()}>
            <span className="p-float-label mb-4" >
                <InputText id="title" className={'w-100 ' } value={selectedTitle} onChange={(e) => setselectedTitle(e.target.value)} />
                <label htmlFor="title">Titlu</label>  
            </span>
            <span className="p-float-label mb-4">
          <Calendar id="date" value={selectedDate} onChange={(e) => setselectedDate(e.value)}></Calendar>
          <label htmlFor="date">Data</label>
        </span>
        <span className="p-float-label mb-4" >
             <InputText id="listOfAuthors" className={'w-100 ' } value={selectedListOfAuthors} onChange={(e) => setSelectedListOfAuthors(e.target.value)} />
             <label htmlFor="listOfAuthors">Autori</label>  
         </span>
        </Dialog>

      <h2 style={{  padding: "20px",color:"blue" }}>
        Adauga o referinta pentru articolul curent
      </h2>
      <div className="ms-3">
        <span className="p-float-label mt-4">
          <InputText id="title" value={title} onChange={(e) => setTile(e.target.value)}/>
          <label htmlFor="title">Titlu</label>
        </span>
        <span className="p-float-label mt-4">
          <Calendar id="date" value={date} onChange={(e) => setDate(e.value)}></Calendar>
          <label htmlFor="date">Data</label>
        </span>
        <span className="p-float-label  mt-4" >
             <InputText id="listOfAuthors" value={listOfAuthors} onChange={(e) => setListOfAuthors(e.target.value)} />
             <label htmlFor="listOfAuthors">Autori</label>  
         </span>
        <Button className="p-float-label  mt-4" label="Adauga" icon="pi pi-plus" onClick={addReference} />
      </div>
      </div>
  )
}

export default Reference;
