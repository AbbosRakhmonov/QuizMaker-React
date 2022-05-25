import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';


function MyDocument({final, history, trueAnswers, username, surname}) {
    const ref = React.createRef();
    const saveAsPdf = () => {
        const input = ref.current;
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;

            const doc = new jsPDF('p', 'mm', "a4");
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight+10);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight+10);
                heightLeft -= pageHeight;
            }
            doc.save(`quizmaker_${new Date()}_${username}.pdf`);
        })
    }
    useEffect(() => {
        final.length === 0 && history.push("/")
    }, [final, history]);
    return (<>
        <div className={'container'} style={{maxWidth: '210mm',}}>
            <div className="row" ref={ref}>
                <div className="col-md-12">
                    <h4 className={'display-6 text-center mb-3 text-primary'}>Quiz Maker</h4>
                    <h6 className={'text-center text-success'}>CANDIDATE: <span
                        className={'text-danger text-uppercase ms-2'}>{surname} {username}</span></h6>
                    <p className={'text-center text-muted'}>Result: {trueAnswers} / {final.length}</p>
                </div>
                <div className="col-md-12">
                    {
                        final.map((prev, index) => <table className={'table table-bordered mb-4'} key={index + 1}>
                            <thead className={'bg-primary text-light'}>
                            <tr>
                                <th>{index + 1}. {prev.title}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                prev.answers.map((answer, index) => <tr key={index + 1}
                                                                        className={answer.checked ? "table-secondary" : ""}>
                                    <td>{answer.title}</td>
                                </tr>)
                            }
                            </tbody>
                        </table>)
                    }
                </div>
            </div >
            <div className="row">
                <div className="col-md-12 text-end mb-4">
                    <Link to={'/'} className={'btn btn-danger py-2 px-5'}>Back</Link>
                    <button onClick={saveAsPdf} className={'btn btn-success py-2 px-5 ms-2'}>Download
                    </button>
                </div>
            </div>
        </div>
    </>);
}

export default MyDocument;