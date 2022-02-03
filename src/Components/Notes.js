import NoteItem from './NoteItem';
import { AddNote } from './AddNote';
import { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../Context/notes/noteContext';
import { useHistory } from 'react-router-dom';

function Notes() {
    const context = useContext(noteContext);
    const { notes, getNotes, editNote } = context
    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" });

    const ref = useRef(null)
    const refClose = useRef(null)

    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes()
        }
        else {
            history.push("/login")
        }
        // eslint-disable-next-line
    }, []);

    const updateNote = (currentnote) => {
        ref.current.click()
        setNote({ id: currentnote._id, etitle: currentnote.title, edescription: currentnote.description, etag: currentnote.tag })
    }


    const handleClick = (e) => {
        console.log('updating', note)
        editNote(note.id, note.etitle, note.edescription, note.etag)
        refClose.current.click()
    }

    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return <>
        <AddNote />


        <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="etitle" className="form-label">Title</label>
                                <input type="text" className="form-control" value={note.etitle} name='etitle' id="etitle" onChange={onchange} minLength={5} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="edescription" className="form-label">Description</label>
                                <input type="text" className="form-control" value={note.edescription} name='edescription' id="edescription" onChange={onchange} minLength={5} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="etag" className="form-label">Tag</label>
                                <input type="text" className="form-control" value={note.etag} name='etag' id="etag" onChange={onchange} minLength={5} required />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button disabled={note.etitle.length < 5 || note.edescription.length < 5 || note.etag.length < 5} type="button" onClick={handleClick} className="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="container">
            <h1>Your Notes</h1>
            {notes.length === 0 && 'no notes to diisplay'}
            <div className="container d-flex justify-content-around">
                {notes.map((note) => {
                    return <NoteItem note={note} key={note._id} updateNote={updateNote} />;
                })}
            </div>
        </div>
    </>;
}

export default Notes;
