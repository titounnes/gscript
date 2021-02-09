# titoFramework
simple  framework with google script 

[View Result](https://docs.google.com/spreadsheets/d/1uYiE6KdjZLN_0nrVetTFUEGP_Pf5fiqAuinMhgUYaTY/edit?usp=sharing)

[url API : https://script.google.com/macros/s/AKfycbzC89SW5iNKCYmhOX0MS_Umw9ZNFW-tPEnYvIy_ZTwt1QeQAvj8/exec](9https://script.google.com/macros/s/AKfycbzC89SW5iNKCYmhOX0MS_Umw9ZNFW-tPEnYvIy_ZTwt1QeQAvj8/exec)


## Method : post

  ### param 
    * route : books/put (insert/update)
    * id: [alphanumeric|min_length[5]|max_length[20]|required]
    * title: [alphanumeric|min_length[3]|max_length[50]|required]
    * author : [alphanumeric|min_length[3]|max_length[50]|required]
  
 ### param 
    * route : books/delete (soft delete)
    * id : [alphanumeric] 

## Method : get
  ### param 
    * route : books (get books by id)
    * id : [alphanumeric]
  ### param
    * route : books (get all some books)
    * offset : [int]
    * limit : [int]
    
## Explanation
This application using google sheet as database

## TO Do List
  * Authentication
  * telegram bot
  * pagination
  * enganced validation with another option like strong pasword, unique key, email etc.

## Donation
[Paypal](https://www.paypal.me/harjito)
