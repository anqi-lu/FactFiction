from __future__ import print_function

import nltk
import csv
import os
import re
import sys
import string

BRACKETS = ['(', ')', '[', ']', '{', '}', '``', '"', '<', '>']

class AggregateRawData:
    """ 
    This class tokenizes sentences in the articles of all categories for each news
    source. After that, it aggregates all sentences in one tsv file for each news
    source.

    Expected directory hierarchy and output location:
    /data
        /bcc
            /raw
                /business
                /entertainment
                ...
            all.tsv (output)
        /cnn
            /raw
                /cnn_crime
                /cnn_entertainment
                ...
            all.tsv (output)
        ...
    """
    def __init__(self, path_prefix):
        self.path_prefix = path_prefix
        self.all_sentences = []
        self.COLUMNS = [
            'sentence',
            'category',
            'file_name',
            'index'
        ]

    def aggregate(self, dataset_path, categories, uml):
        """ Process raw dataset to create amassed train, val, 
            and test data files.

            Args:
                dataset_path - the path to the raw data.
                categories - list of subfolders
                uml - whether or not to parse for <TEXT> tags
        """
        print('Processing dataset:', dataset_path)
        sentences = []
        for c in categories:
            # tokenize all files for a category
            print('\tCategory:', c)
            sent = self.__tokenize_category(dataset_path, c, uml)
            sentences.extend(sent)

        self.all_sentences.extend(sentences)


        # write all the sentences to the same place.
        output_path = '{}/{}/all.tsv'.format(self.path_prefix, dataset_path)
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f, delimiter='\t')
            writer.writerow(self.COLUMNS)
            writer.writerows(sentences)

    def __get_file_list(self, category):
        """ Lists all files in the sub-folder for a category. """
        return os.listdir(category)
    
    def __detokenize_imdb(self, sent):
        # Change "u . s . a ." to "u.s.a."
        sent = re.sub(r'(\w) \. (\w) \. (\w) \.', r'\1.\2.\3.', sent)
        # Change "u . s ." to "u.s."
        sent = re.sub(r'(\w) \. (\w) \.', r'\1.\2.', sent)
        sent = sent.replace('. . .', '...')
        tokens = sent.split(' ')
        # Add space before a non-punctuation token
        tokens = [" " + i if not i.startswith("'")
                         and ( i not in string.punctuation
                            or i in BRACKETS )
                         else i for i in tokens ]
        return "".join(tokens).strip()

    def __tokenize_category(self, dataset_path, category, uml):
        """ Tokenize all files in a category (into sentences).

            Args: 
                dataset_path - the path to the raw data.
                category - the type of article (maps to a subfolder.)

            Returns:
                the list of sentences from all the files in a category
        """
        file_names = self.__get_file_list("{}/{}/raw/{}/".format(
            self.path_prefix, dataset_path, category))
        out = []
        for fn in file_names:
            path_format = self.path_prefix + "/{}/raw/{}/{}"
            path = path_format.format(dataset_path, category, fn)
            with open(path, 'r', encoding='utf-8', errors='ignore') as df:
                # the imdb dataset is handled differently
                if 'imdb' in dataset_path:
                    text = df.read()
                    detok = [self.__detokenize_imdb(sent) for sent in text.split('\n')]
                    sent = nltk.sent_tokenize(' '.join(detok))
                else:
                    text = df.read().replace('\n', ' ')
                    if uml:
                        if '<TEXT>' in text:
                            text = text.split('<TEXT>')[1].split('</TEXT>')[0]
                        else:
                            print('warning:', fn, 'does not have <TEXT> tag')
                    sent = nltk.sent_tokenize(text)
                out.extend([[ s, category, fn, i ] for i,s in enumerate(sent)])
        return out   

    def write_all_cached_sentences(self):
        output_path = self.path_prefix + '/master_all.tsv'
        with open(output_path, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f, delimiter='\t')
            writer.writerow(self.COLUMNS)
            writer.writerows(self.all_sentences)


if __name__ == "__main__":
    configs = [
        {
            "dataset_path": "bbc",
            "categories": [
                'business',
                'entertainment',
                'politics',
                'sport',
                'tech'
            ],
            "uml": False
        }, 
        {
            "dataset_path": "fake",
            "categories": [
                'buzzfeedfake',
                'randomfake',
                'randomsatire'
            ],
            "uml": False
        }, 
        {
            "dataset_path": "cnn",
            "categories": [
                'cnn_crime',
                'cnn_entertainment',
                'cnn_health',
                'cnn_living',
                'cnn_politics',
                'cnn_technology',
                'cnn_travel'
            ],
            "uml": True
        }, 
        {
            "dataset_path": "fox",
            "categories": [
                'foxnews_health',
                'foxnews_science_technology',
                'foxnews_sports',
                'foxnews_travel'
            ],
            "uml": True
        },
        {
            "dataset_path": "imdb",
            "categories": [
                '.'
            ],
            "uml": False
        },
        {
            'dataset_path': 'wiki',
            'categories': [
                '.'
            ],
            'uml': False
        },
        {
            'dataset_path': 'custom',
            'categories': [
                '.'
            ],
            'uml': False
        }
    ]

    path_prefix = sys.argv[1] if len(sys.argv) >= 2 else '.'
    process = AggregateRawData(path_prefix)
    for config in configs:
        process.aggregate(config['dataset_path'], config['categories'], config['uml'])
    process.write_all_cached_sentences()