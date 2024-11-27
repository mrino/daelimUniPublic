import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import BottomSheet from "./bottom-sheet";
import axios from "axios";
import useFetchFilteredData from "./useFetchFilteredData";

const FilterDataScreen: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { data, loading, error } = useFetchFilteredData(selectedFilters);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet setSelectedFilters={setSelectedFilters} />
      {loading ? (
        <ActivityIndicator size="large" color="#5856D6" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      )}
    </View>
  );
};

export default FilterDataScreen;
