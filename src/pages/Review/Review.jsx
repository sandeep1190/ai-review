import React, { useState, useEffect } from "react";
import "./Review.scss";
import { FaReply, FaClipboardList } from "react-icons/fa";
import LocationModal from "../../components/LocationModal/LocationModal";
import { Calendar } from 'primereact/calendar';
import FilterIcon from "../../assets/Icons/FilterIcon";
import ClipboardIcon from "../../assets/Icons/ClipboardIcon";
import ReplyIcon from "../../assets/Icons/ShareIcon";

const reviews = [
    {
        name: "Ann Culhane",
        rating: 5,
        comment: "Kerri is a true professional, an expert at intake, and just a pleasure to work..",
        postedAt: "14, February 2025"
    },
    {
        name: "John Doe",
        rating: 4,
        comment: "Very responsive and kind team.",
        postedAt: "10, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
    {
        name: "Jane Smith",
        rating: 3,
        comment: "Decent service, could improve follow-up.",
        postedAt: "5, February 2025"
    },
];

const Review = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const totalReviews = reviews.length;
    const indexOfLastReview = currentPage * rowsPerPage;
    const indexOfFirstReview = indexOfLastReview - rowsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(totalReviews / rowsPerPage);

    useEffect(() => {

        const fetchData = async () => {
            try {
                
                const response = await fetch('your-api-endpoint');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]); 
            }
        };

        fetchData();
    }, []);

    return (
        <div className="review-page">
            <div className="review-section">
                <div className="top-section">
                    <div className="sort-ftr">
                        <div className="filters">
                            <Calendar
                                value={startDate}
                                onChange={(e) => setStartDate(e.value)}
                                placeholder="Start Date"
                                dateFormat="yy-mm-dd"
                                showIcon
                            />
                            <span>–</span>
                            <Calendar
                                value={endDate}
                                onChange={(e) => setEndDate(e.value)}
                                placeholder="End Date"
                                dateFormat="yy-mm-dd"
                                showIcon
                            />
                        </div>
                        <span className="filter-icon">
                            <FilterIcon />
                        </span>
                        <span className="reset-filters">
                            Reset Filters
                        </span>
                    </div>

                    <button onClick={() => setShowModal(true)} className="sync-btn">
                        Sync Locations
                    </button>
                </div>
                <table className="review-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Rating</th>
                            <th>Comments</th>
                            <th>Posted At</th>
                            <th>Reply</th>
                            <th>Posted On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentReviews.map((rev, i) => (
                            <tr key={i}>
                                <td style={{ width: 190, fontWeight:500 }}>{rev.name}</td>
                                <td>{[...Array(rev.rating)].map((_, i) => <span key={i}>⭐</span>)}</td>
                                <td style={{ width: 350 }}>{rev.comment}</td>
                                <td>{rev.postedAt}</td>
                                <td></td>
                                <td></td>
                                <td>
                                    <div className="action-btn">
                                        <span>
                                            <ClipboardIcon/>
                                        </span>
                                        <span>
                                            <ReplyIcon/>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="pagination">
                <div className="page-info">
                    {indexOfFirstReview + 1}–{Math.min(indexOfLastReview, totalReviews)} of {totalReviews}
                </div>
                <div className="page-controls">
                    <label>Rows per page:</label>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                    </select>

                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ◀
                    </button>
                    <span>{currentPage}/{totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        ▶
                    </button>
                </div>
            </div>

            <LocationModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>


    );
};

export default Review;
