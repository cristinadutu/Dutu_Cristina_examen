import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';

const SERVER = "http://localhost:8080/api";

function Article() {
  const navigateTo = useNavigate();


  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [date, setDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const[search1, setSearch1] = useState('')
  const[search2, setSearch2] = useState('')
 

  const[dropdawnSortare, setDropdawnSortare] = useState('');
 
const categoriiSortare = [
  { name: 'title', value: 'title' },
  { name: 'summary', value: 'summary' },
  { name: 'date', value: 'date' },
];
  

//OPERATII CRUD PE TABELA
  const getArticles = async () => {
    try {
      
       let path = `${SERVER}/articles`;
        if(search1 && !search2 && !dropdawnSortare) {
          path+=`?titleS=${search1}`
      }
       else if(search2 && !search1 && !dropdawnSortare){
        path+=`?summaryS=${search2}`
      }else if(!search1 && !search2 && dropdawnSortare){
        path+=`?sortBy=${dropdawnSortare}`
      }
      else if (search1 && dropdawnSortare && !search2){
        path+=`?titleS=${search1}&sortBy=${dropdawnSortare}`
      }else if(search2 && !search1 && dropdawnSortare){
        path+=`?summaryS=${search2}&sortBy=${dropdawnSortare}`
      }
      else if (search2 && search1 && !dropdawnSortare){
        path=`${SERVER}/articles?titleS=${search1}&summaryS=${search2}`
      }else if(search2 && search1 && dropdawnSortare){
        path=`${SERVER}/articles?titleS=${search1}&summaryS=${search2}&sortBy=${dropdawnSortare}`
      }
      const response = await fetch(path);
      const data = await response.json();
      setArticles(data);

     
    } catch (err) {
      console.warn(err);
    }
  };


  const addArticle = async() => {
    if(!title || !summary || !date) {
      alert('Aveti campuri necompletate')
      return;
    }
    if(title.length<5) {
      alert('Titlul trebuie sa aiba minimum 5 caractere')
      return;
    }
    if(summary.length<5) {
        alert('Descrierea trebuie sa aiba minimum 10 caractere')
        return;
      }

    try {
      const response = await fetch(`${SERVER}/articles`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title,
            summary,
            date
          })
      });
      setTitle('');
      setDate('');
      setSummary('');
      if(!response.ok) {
          throw response
      }
      getArticles()
    } catch (err) {
      console.warn(err);
    }
  }



  const deleteArticle = async(row) => {
    try {
      const response = await fetch(`${SERVER}/articles/${row.id}`, {
          method: 'DELETE'
      });
      if(!response.ok) {
          throw response
      }

      getArticles();
    } catch (err) {
      console.warn(err);
    }
  }



  const updateArticle = async(data) => {
    try {
        if(!data.title || !data.summary || !data.date) {
            alert('Aveti campuri necompletate')
            return;
          }
          if(data.title.length<5) {
            alert('Titlul trebuie sa aiba minimum 5 caractere')
            return;
          }
          if(data.summary.length<5) {
              alert('Descrierea trebuie sa aiba minimum 10 caractere')
              return;
            }
      const response = await fetch(`${SERVER}/articles/${data.id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if(!response.ok) {
          throw response
      }

      getArticles();
    } catch (err) {
      console.warn(err);
    }
  }



 
  useEffect(() => {
    getArticles();
  }, [search1, search2,dropdawnSortare]);



  const columnForDelete = (rowData) => {
    return <Button onClick={() => deleteArticle(rowData)} icon="pi pi-minus" className="p-button-rounded p-button-danger p-button-text" tooltip="Stergere articol"/>
  }


  const columnForDetails = (rowData) => {
    return <Button onClick={() => goToReferences(rowData)} icon="pi pi-eye" className="p-button-rounded p-button-success p-button-text" tooltip="Detalii referinte"/>
  }


  const goToReferences = (rowData) => {
    navigateTo(`/${rowData.id}/references`)
  }



  const editorForText = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

 
  const editorForDate = (options) => {
    return <Calendar value={options.value} placeholder="Selectati o noua data" onChange={(e) => options.editorCallback(e.target.value)}/>
  }

  const onRowEditComplete = (e) => {
    updateArticle(e.newData);
  }



  function exportToJsonFile() {
    
}

  return (
    <div>
      <h2 style={{ borderBottom: "solid 1px black", padding: "10px",color:"blue" }}>
        Articole disponibile
      </h2>
       <div style={{display:'flex', justifyContent:"space-between"}} >
          <InputText id="searchTitle"  placeholder="Cautare dupa titlu"  className="w-25rem mb-4" value={search1} onChange={(e) => setSearch1(e.target.value)} />
          <InputText id="searchSummary"  placeholder="Cautare dupa descriere" className="w-25rem mb-4" value={search2} onChange={(e) => setSearch2(e.target.value)} />
          <Dropdown value={dropdawnSortare} options={categoriiSortare} onChange={(e) => setDropdawnSortare(e.target.value)} optionLabel="name" placeholder="Selectati un camp pentru sortare" />
          <Button className="w-25rem mb-4" label="Export" icon="pi pi-plus" onClick={exportToJsonFile} />
       </div>
      
      <DataTable value={articles} responsiveLayout="scroll" editMode="row" onRowEditComplete={onRowEditComplete} paginator rows={8}>
        <Column field="id" header="Id" style={{ width: '10%' }}></Column>
        <Column field="title" header="Titlu" style={{ width: '20%' }} editor={(options) => editorForText(options)}></Column>
        <Column field="summary" header="Rezumat" style={{ width: '20%' }} editor={(options) => editorForText(options)} ></Column>
        <Column field="date" header="Data" style={{ width: '20%' }} editor={(options) => editorForDate(options)}></Column>
        <Column body={columnForDelete} style={{ width: '10%' }}></Column> 
        <Column rowEditor style={{ width: '10%' }}></Column>
        <Column body={columnForDetails} style={{ width: '10%' }}></Column> 
      </DataTable>
      <h2 style={{  padding: "20px",color:"blue" }}>
        Adauga un articol
      </h2>
      <div className="ms-3">
        <span className="p-float-label mt-4">
          <InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label htmlFor="title">Titlu</label>
        </span>
        <span className="p-float-label mt-4">
          <InputText id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
          <label htmlFor="summary">Rezumat</label>
        </span>
        <span className="p-float-label mt-4">
          <Calendar id="date" value={date} onChange={(e) => setDate(e.value)}></Calendar>
          <label htmlFor="date">Date</label>
        </span>
        <Button className="mt-4" label="Adauga" icon="pi pi-plus" onClick={addArticle} />
      </div>
    </div>
  );
}

export default Article;
