from thefuzz import fuzz
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from pymongo import MongoClient
import sys


# allSent[s] = fuzz.ratio(theSentence,sentences[s])
# allSent[s] = fuzz.token_sort_ratio(sentences[s],theSentence)
# allSent[s] = fuzz.partial_ratio(sentences[s],theSentence)
# allSent[s] = fuzz.token_set_ratio(sentences[s],theSentence)
# nltk.download('punkt')


def removeStopWords(text):
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(text)
    return ' '.join([w for w in word_tokens if not w.lower() in stop_words])


dbName = 'persian_framenet'
connection = MongoClient("mongodb://127.0.0.1:27017")
database = connection[dbName]
id = sys.argv[1]
theSentence = removeStopWords(sys.argv[2].lower())
lexicalUnit = sys.argv[3].lower()

if lexicalUnit == '@':
    lexicalUnit = None
else:
    lexicalUnit = lexicalUnit[1:]

count = int(sys.argv[4])

if count < 0 or count > 1000:
    count = 50

searchFilter = {
    'lang' : 1
}
if lexicalUnit is not None:
    #searchFilter[ 'lexicalUnitName'] = {'$regex': lexicalUnit,'$options': 'i'}
    searchFilter[ 'lexicalUnitName'] = lexicalUnit

sentences = [
    {
        '_id' : str(r['_id']),
        'words' : r['words'],
        'frameName' : r['frameName'],
        'frameNetTags' : r['frameNetTags'],
        'lexicalUnitName' : r['lexicalUnitName'],
        'ratio' : fuzz.ratio(r['words'], theSentence)
    } for r in database['taggedsentences'].find(searchFilter).sort('sentence')
]

sentences.sort(key=lambda el: el['ratio'],reverse=True)

data = [sentences[i] for i in range(count if count < len(sentences) else len(sentences))]
for i in range(len(data)):
    for j in range(len(data[i]['frameNetTags'])):
        if data[i]['frameNetTags'][j]['element'] is not None:
            data[i]['frameNetTags'][j]['element'] = database['elements'].find_one({'_id':data[i]['frameNetTags'][j]['element']})

database['helpers'].insert_one({
    'id' : id,
    'data' : data
})

#python test22.py "id" "They ask the people present at the place to contact other aid groups" "ask" "20"