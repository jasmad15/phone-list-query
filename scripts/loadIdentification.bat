
SET FILE=D:\FUJJAS\Downloads\170908_Lista_Blanca\Lista_Blanca.txt

cd C:\Program Files\MongoDB\Server\3.4\bin\

set timespan1=%date:~-4%%time:~0,2%%time:~3,2%%time:~6,2%
echo %timespan1%
pause
echo "-d validador -c identification_%timespan1% --type csv --file %FILE% --headerline"
pause
mongoimport.exe -d validador -c identification_%timespan1% --type csv --file %FILE% --headerline
pause
echo %timespan1%
mongo validador -u validador -p Val2$68 --authenticationDatabase validador --eval "db.identification_%timespan1%.createIndex( { CIF_NIF: 1 } );"



 