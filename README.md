# gscript
simple  framework with google script 

url Respond (google sheet) : https://docs.google.com/spreadsheets/d/1uYiE6KdjZLN_0nrVetTFUEGP_Pf5fiqAuinMhgUYaTY/edit?usp=sharing
url API : https://script.google.com/macros/s/AKfycbzC89SW5iNKCYmhOX0MS_Umw9ZNFW-tPEnYvIy_ZTwt1QeQAvj8/exec

## Method : post
  ### param 
    * route : present/put (insert/update)
    * nis: [alfanumerik|min_length[5]|max_length[20]|required]
    * nama: [alfanumerik|min_length[3]|max_length[50]|required]
    * status : [integer|min[0]|max[3]|require]
  
 ### param 
    * route : present/delete (soft delete)
    * nis : [alfanumerik|min_length[5]|max_length[20]|required] 

## Method : get
  ### param 
    * route : present (get by nis)
    * nis : [varchar]
  ### param
    * route : present (get from offset to limit)
    * offset : [int]
    * limit : [int]
    
    
