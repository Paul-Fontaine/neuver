<?php

require_once "DB.php";

class Research
{
    /**
     * make a case insensitive search that returns all song where the string searched matched the name of the song/album/artist
     * tested but not in every scenario possible
     * @param string $textToSearch
     * @return array|false choose what you want to be returned by adding some columns in the SELECT
     */
    static function searchSongs(string $textToSearch)
    {
        try {
            $db = DB::connexion();

            $request = "
            SELECT m.nom_morceau FROM morceau m
            JOIN album al on al.id_album = m.id_album
            JOIN artiste ar on ar.id_artiste = al.id_artiste
            WHERE m.nom_morceau ILIKE CONCAT('%', :textToSearch::text, '%')
            OR al.nom_album ILIKE CONCAT('%', :textToSearch::text, '%')
            OR ar.nom_artiste ILIKE CONCAT('%', :textToSearch::text, '%')
            ;
            ";
            $statement = $db->prepare($request);
            $statement->bindParam(':textToSearch', $textToSearch, PDO::PARAM_STR);
            $statement->execute();

            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }

    }

    /**
     * make a case insensitive search to find albums where the $textToSearch match the name of the album/artiste<br>
     * ! partially tested, it may works
     * @param string $textToSearch
     * @return array|false choose what you want to be returned by adding some columns in the SELECT
     */
    static function searchAlbums(string $textToSearch)
    {
        try {
            $db = DB::connexion();

            $request = "
            SELECT nom_album FROM album
            JOIN artiste on artiste.id_artiste = album.id_artiste
            WHERE nom_album ILIKE CONCAT('%', :textToSearch::text, '%')
            OR nom_artiste ILIKE CONCAT('%', :textToSearch::text, '%')
            ";
            $statement = $db->prepare($request);
            $statement->bindParam(':textToSearch', $textToSearch, PDO::PARAM_STR);
            $statement->execute();

            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }


    /**
     * make a case insensitive search <br>
     *
     * @param string $textToSearch
     * @return array|false choose what you want to be returned by adding some columns in the SELECT
     */
    static function searchArtists(string $textToSearch)
    {
        try {
            $db = DB::connexion();

            $request = "
            SELECT nom_artiste FROM artiste
            WHERE nom_artiste ILIKE CONCAT('%', :textToSearch::text, '%')
            ";
            $statement = $db->prepare($request);
            $statement->bindParam(':textToSearch', $textToSearch, PDO::PARAM_STR);
            $statement->execute();

            $result = $statement->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        }
        catch (PDOException $exception)
        {
            error_log('Request error: '.$exception->getMessage());
            return false;
        }
    }
}

$result = Research::searchArtists('e');
if ($result){
    var_dump($result);
} else {
    echo "error";
}
