import React, { useState } from 'react';

const MedicalRecordList = ({ records }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [editRecordId, setEditRecordId] = useState(null);
  const [editData, setEditData] = useState({
    date: '',
    hospital: '',
    medication: '',
    treatment: '',
    memo: '',
  });

  const handleDelete = (id) => {
    // TODO: Spring Boot에 DELETE 요청 보내기
    alert(`기록 ${id} 삭제`);
  };

  const handleEditClick = (record) => {
    setEditRecordId(record.id);
    setEditData({ ...record });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = () => {
    // TODO: Spring Boot에 PUT 요청 보내기
    alert(`기록 ${editRecordId} 수정됨`);
    setEditRecordId(null);
  };

  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  const showMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="medical-record-list">
      <div className="dropdown-header" onClick={toggleDropdown} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        ▶ 병원 진료 기록 목록
      </div>

      {isOpen && (
        <div className="record-list" style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '10px' }}>
          {sortedRecords.slice(0, visibleCount).map((record) => (
            <div key={record.id} className="record-item" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '8px' }}>
              {editRecordId === record.id ? (
                <div>
                  <input type="date" name="date" value={editData.date} onChange={handleChange} />
                  <input type="text" name="hospital" value={editData.hospital} onChange={handleChange} placeholder="병원명" />
                  <input type="text" name="medication" value={editData.medication} onChange={handleChange} placeholder="처방약" />
                  <input type="text" name="treatment" value={editData.treatment} onChange={handleChange} placeholder="진료 내용" />
                  <input type="text" name="memo" value={editData.memo} onChange={handleChange} placeholder="메모" />
                  <button onClick={handleSave}>수정 저장</button>
                </div>
              ) : (
                <div>
                  <strong>{record.date}</strong> | {record.hospital} | {record.medication} | {record.treatment} | {record.memo}
                  <div style={{ marginTop: '5px' }}>
                    <button onClick={() => handleEditClick(record)}>수정</button>
                    <button onClick={() => handleDelete(record.id)} style={{ marginLeft: '5px' }}>삭제</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {sortedRecords.length > visibleCount && (
            <button onClick={showMore}>+ 더보기</button>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;