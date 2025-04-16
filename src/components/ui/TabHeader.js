import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import theme from '../../themes/theme';

const TabHeader = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabsScrollContainer}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              activeTab === tab.id && styles.activeTabItem,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabsScrollContainer: {
    flexGrow: 1,
    width: '100%',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 0,
    width: '100%',
  },
  tabItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    flex: 1,
  },
  activeTabItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 3,
    borderBottomColor: '#eaeaea',
  },
  tabText: {
    fontSize: 13.5,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#111',
  },
});

export default TabHeader; 