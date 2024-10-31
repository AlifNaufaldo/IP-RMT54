import { useEffect, useState } from "react";
import animeAPI from "../api/AnimeApi";
import CardAnime from "../components/Card/Card";
import GeminiAI from "../components/GeminiAi/GeminiAI";
import Swal from "sweetalert2";
import "./HomePage.css"

export default function HomePage() {
  const [anime, setAnime] = useState([]);
  const [pageGroup, setPageGroup] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchAnimes = async (pageNum) => {
    try {
      const response = await animeAPI.get(`/anime?page=${pageNum}`);
      setAnime(response.data.data);
      setTotalPages(response.data.pagination.last_visible_page);
      console.log(response.data.data);
    } catch (err) {
      console.error("🚀 ~ fetchAnimes ~ err:", err);
      const message = err.response ? err.response.data.message : "Failed to fetch anime";
      Swal.fire("Error", message, "error");
    }
  };

  useEffect(() => {
    fetchAnimes(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      if (newPage % 5 === 1) {
        setPageGroup(Math.floor((newPage - 1) / 5) + 1);
      }
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      if (newPage % 5 === 0) {
        setPageGroup(Math.floor((newPage - 1) / 5) + 1);
      }
    }
  };

  const startPage = (pageGroup - 1) * 5 + 1;
  const endPage = Math.min(pageGroup * 5, totalPages);

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
    setPageGroup(Math.floor((pageNum - 1) / 5) + 1);
  };

  return (
    <section>
      <div className="d-flex justify-content-center py-5 flex-wrap gap-5">
        {anime.map((e) => (
          <CardAnime key={e.mal_id} anime={e} fetchAnimes={fetchAnimes} />
        ))}
      </div>

      <div className="pagination-controls d-flex justify-content-center">
  <ul className="pagination d-flex">
    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={handlePreviousPage}
        disabled={page === 1}
      >
        &lt;
      </button>
    </li>

    {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
      const pageNumber = startPage + i;
      return (
        <li
          key={pageNumber}
          className={`page-item ${pageNumber === page ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      );
    })}

    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={handleNextPage}
        disabled={page === totalPages}
      >
        &gt;
      </button>
    </li>
  </ul>
</div>


      <div className="chat-container text-center mb-4 justify-content-center">
        <GeminiAI />
      </div>
    </section>
  );
}
