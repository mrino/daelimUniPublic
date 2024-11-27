// useFetchFilteredData.tsx
import { useState, useEffect } from "react";
import axios from "axios";

interface Item {
    id: number;
    name: string;
  }

const useFetchFilteredData = (selectedFilters: string[]) => {
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (selectedFilters.length === 0) {
        setData([]); // 필터가 선택되지 않은 경우 데이터를 비웁니다.
        return;
      }
  
      const fetchData = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const response = await axios.get("https://api.example.com/data", {
            params: { filters: selectedFilters.join(",") },
          });
          setData(response.data); // 필터링된 데이터로 상태를 업데이트합니다.
        } catch (err) {
          setError("데이터를 불러오는데 실패했습니다.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [selectedFilters]);
  
    return { data, loading, error };
  };
  


export default useFetchFilteredData;
