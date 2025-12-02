import MultiSelect from "react-native-multiple-select";
import { useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import { Button } from "react-native-elements";
import { useSQLiteContext } from "expo-sqlite";

import languageTranslationJSON from 'assets/Translations.json';

import { Container } from "components/Container";
import { ScreenContent } from "components/ScreenContent";
import { useAppNavigation } from "components/Navigation";
import { LoadingScreen } from "components/LoadingScreen";

import { getAllUserLanguages, insertUserLanguage, setDeletedByName } from "services/dbLanguageService";
import { UserLanguage } from "models/models";

export default function SettingsScreen() {
    const db = useSQLiteContext();
    const { height } = useWindowDimensions();
    const maxDropdownHeight = height * 0.4;
    const navigation = useAppNavigation();

    const [dbLanguages, setDbLanguages] = useState<UserLanguage[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const JSONlanguages = languageTranslationJSON.map(
        (languageBlock, index) => ({
            id: index,
            name: languageBlock.language
        })
    );

    useEffect(() => {
        setLoading(true);
        getAllUserLanguages(db)
            .then((languages) => {
                setDbLanguages(languages) 
                const matchedIds = JSONlanguages
                    .filter(jsonLang => languages.some(dbLang => dbLang.name === jsonLang.name 
                                                                 && dbLang.deleted === 'N'))
                    .map(lang => lang.id);

                setSelectedItems(matchedIds);
            })
            .finally(() => setLoading(false));
    }, []);

    function handleSelectedItemsChange(selectedIds: number[]) { setSelectedItems(selectedIds); }

    function handleButtonPress() {
        const selectedLanguages = JSONlanguages.filter( lang => selectedItems.includes(lang.id) );
        const dbLangMap = new Map( dbLanguages
                                    .filter(lang => lang.deleted === "N")
                                    .map(lang => [lang.name, lang])
                                 );

        selectedLanguages.forEach(language => {
            if (!dbLangMap.get(language.name)) {
                insertUserLanguage(db, language.name).then( (e) => {
                });
            } 
        });

        dbLanguages.forEach(dbLang => {
            const stillSelected = selectedLanguages.some(
                lang => lang.name === dbLang.name
            );

            if (!stillSelected && dbLang.deleted === "N") {
                setDeletedByName(db, dbLang.name);
            }
        });
        navigation.navigate("Home");
    }

    if (loading){ return ( <LoadingScreen/> ) }
  
    return (
        <Container>
            <ScreenContent title="Settings" scrollViewEnabled={false}>
                <MultiSelect
                    items={JSONlanguages}
                    onSelectedItemsChange={handleSelectedItemsChange}
                    hideTags
                    uniqueKey="id"
                    selectText="Pick Items"
                    searchInputPlaceholderText="Search Items..."
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItems={selectedItems}
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    styleListContainer={{maxHeight: maxDropdownHeight}}
                    searchInputStyle={{ color: '#CCC' }}
                    hideSubmitButton={true}>
                </MultiSelect>
                <Button title="Save and Exit" onPress={handleButtonPress}/>
            </ScreenContent>
        </Container>
    );
};