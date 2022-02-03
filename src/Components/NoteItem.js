import React from 'react';
import { useContext } from 'react';
import noteContext from '../Context/notes/noteContext';

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;

    const { note, updateNote } = props;
    return <>
        <div className="card col-md-3 mx-2 my-2 ">
            <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.description}</p>
                <p className="card-text">{note.tag}</p>
                <i className="fas fa-trash-alt mx-2" onClick={() => { deleteNote(note._id) }}></i>
                <i className="fas fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
            </div>
        </div>
    </>
};

export default NoteItem;
