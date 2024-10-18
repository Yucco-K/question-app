'use client';

import styles from '@/app/components/questions/QuestionDetail.module.css';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Notification from '../../components/ui/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faUserGraduate, faUser, faCrown, faAward, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import UserProfileImage from '@/app/components/profile/UserProfileImage';
import UserNameDisplay from '@/app/components/profile/UserNameDisplay';
import DOMPurify from 'dompurify';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/app/context/LoadingContext';

interface UserData {
  profileImage?: string;
  email?: string;
  username?: string;
  user_id: string;

}

interface Question {
  user_id: string;
  category_id: string | null;
  is_draft: boolean;
  created_at: string;
  id: string;
  title: string;
  description: string;
  is_resolved: boolean;
  tags: string[];
}

interface Bookmark {
  id: string;
  title: string;
  is_resolved: boolean;
  tags: string[];
  description: string;
}

interface UserStatistics {
  bestAnswerCount: number;
  totalLikes: number;
  totalAnswers: number;
}

export default function MyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarks, setBookmarks] = useState<{
    description(description: any): unknown;
    id: any;
    title: string | undefined;
    category_id: string | null | undefined;
    is_resolved: boolean;
    is_draft: boolean;
    tags: any;
    user_id: string;
    created_at: any; question_id: string
}[]>([]);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { userId } = useParams() as { userId: string };
  const [userStatistics, setUserStatistics] = useState<UserStatistics>({
    bestAnswerCount: 0,
    totalLikes: 0,
    totalAnswers: 0
  });
  const [loading, setLoading] = useState(true);

  const [isPostHistoryOpen, setIsPostHistoryOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  const togglePostHistory = () => setIsPostHistoryOpen(!isPostHistoryOpen);
  const toggleBookmarks = () => setIsBookmarksOpen(!isBookmarksOpen);


  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('ユーザー情報の取得に失敗しました');
      const data = await response.json();
      setUserData(data);
      setProfileImage(data.publicUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 統計情報の取得
  const fetchUserStatistics = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/statistics`);
      const data = await response.json();
      setUserStatistics({
        bestAnswerCount: data.bestAnswerCount,
        totalLikes: data.totalLikes,
        totalAnswers: data.totalAnswers,
      });
    } catch (error) {
      console.error('統計情報の取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    fetchUserStatistics();
    fetchUserData();
    fetchPostHistory();
    fetchBookmarks();
  }, [userId]);


  const fetchPostHistory = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/history`);
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error('投稿履歴の取得に失敗しました:', error);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/bookmarks`);
      const data = await response.json();
      console.log('bookmarks data', data);
      setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []);
    } catch (error) {
      console.error('ブックマークの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([fetchUserData(), fetchPostHistory(), fetchBookmarks()]);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    };

    fetchAllData();
  }, [userId]);


  const handleEditClick = () => {
    router.push(`/users/${userId}/edit`);
  };


  useEffect(() => {
    console.log('Selected Tags updated:', selectedTags);
  }, [selectedTags]);


  return (

    <div className="container mx-auto p-6">
      {showNotification && (error || success) && (
        <Notification
          message={error ?? success ?? ''}
          type={error ? 'error' : 'success'}
          onClose={() => setShowNotification(false)}
        />
      )}

      <section className="mb-8">
        <div className="p-8 bg-white rounded-md shadow-md w-full lg:w-2/3 mx-auto">
          <div className="flex justify-between mb-4">
            <p className="text-xl font-bold text-gray-500">プロフィール</p>
            <button
              className="border border-sky-700 font-bold text-blue-900 px-4 py-2 rounded-sm"
              onClick={handleEditClick}
            >
              編集
            </button>
          </div>

          <div className="flex justify-between items-start border-t border-gray-300 text-md pt-6">

            <div className="w-1/2 pr-4">
              <div className="flex items-center mb-6 gap-10">
                <label className="w-32 font-bold text-blue-900 whitespace-nowrap text-md">
                  プロフィール画像
                </label>
                {userData?.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-16 h-16"
                  />
                ) : (
                  <div className="flex items-center justify-center w-16 h-16 border border-gray-300 rounded-sm">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500" size="2x" />
                  </div>
                )}
              </div>

              <div className="flex items-center mb-6 gap-10">
                <label className="w-32 font-bold text-blue-900 text-sm">メールアドレス</label>
                <p className="text-blue-900 text-md">{userData?.email || 'メールアドレスが登録されていません'}</p>
              </div>

              <div className="flex items-center mb-6 gap-10">
                <label className="w-32 font-bold text-blue-900 text-sm">名前</label>
                <p className="text-blue-900 text-md">{userData?.username || '名前が登録されていません'}</p>
              </div>
            </div>

            <div className="w-1/2 flex flex-col items-end space-y-4">
              <div className="text-blue-900 text-md font-semibold">
                <FontAwesomeIcon icon={faCrown} className="mr-3 mt-4 text-yellow-300 text-2xl" /> ベストアンサー数: {userStatistics.bestAnswerCount}
              </div>
              <div className="text-blue-900 text-md font-semibold">
                <FontAwesomeIcon icon={faThumbsUp} className="mr-6 mt-4 text-orange-300 text-2xl" /> いいね獲得数: {userStatistics.totalLikes}
              </div>
              <div className="text-blue-900 text-md font-semibold">
                <FontAwesomeIcon icon={faUserGraduate} className="mr-12 mt-4 text-green-500 text-2xl" /> 総回答数: {userStatistics.totalAnswers}
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="mb-8">
  <div
    className="cursor-pointer w-full lg:w-2/3 mx-auto bg-blue-200 text-blue-900 rounded-t-lg p-4 flex justify-between items-center"
    onClick={togglePostHistory}
  ><p className="text-lg font-semibold">投稿履歴</p>
  <FontAwesomeIcon
    icon={isPostHistoryOpen ? faChevronUp : faChevronDown}
    className="text-lg"
  />
  </div>

  {isPostHistoryOpen && (
    <div className="space-y-8 w-full lg:w-2/3 mx-auto">
      {questions.length > 0 ? (
        <>
          <div className="flex justify-center">
            <h3 className="text-xl text-center my-4 font-bold text-gray-500">質問</h3>
            <p className="ml-2 font-bold text-gray-500 my-4">( 全 {questions.length} 件 )</p>
          </div>
          {questions.map((question) => {
            const sanitizedDescription = DOMPurify.sanitize(question.description);
            return (
              <Card
                key={`質問ID:${question.id}`}
                id={question.id}
                type="questions"
                title={question.title}
                categoryId={question.category_id}
                onRefresh={fetchPostHistory}
                isResolved={question.is_resolved}
                showReadMoreButton={false}
                footer={<a href={`/questions/${question.id}`} className="hoverScale px-3 py-1 rounded-md text-md text-semibold inline-block">詳細を見る</a>}
                showMenuButton={false}
                isDraft={question.is_draft}
              >
                <div className="text-blue-900 text-sm mb-4">
                  質問ID: {question.id}
                </div>
                <div className="text-blue-900 text-sm mb-4">
                  投稿日時: {question.created_at ? new Date(question.created_at).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  }) : '作成日登録なし'}
                </div>
                {question.is_resolved && (
                  <div className="absolute top-0 right-4 font-semibold text-pink-500 px-4">
                    <FontAwesomeIcon icon={faAward} className="mr-2 text-3xl text-yellow-300" />解決済み
                  </div>
                )}

                <div className='my-10'>
                  <div
                    className={styles.questionBody}
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>
                <div className="flex flex-wrap mt-4">
                  {question.tags?.map((tag, index) => (
                    <span key={index} className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center mt-4">
                  <UserProfileImage userId={question.user_id} />
                  <div className="ml-4">
                    <UserNameDisplay userId={question.user_id} />
                    <div className="text-left text-sm mt-2">
                      {question.created_at ? new Date(question.created_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      }) : '作成日登録なし'}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
        ) : (
        <p className="text-blue-900">質問がありません。</p>
      )}
    </div>
  )}
</section>

    <section className="mb-8">
      <div
        className="cursor-pointer w-full lg:w-2/3 mx-auto bg-indigo-200 text-blue-900 rounded-t-lg p-4 flex justify-between items-center"
        onClick={toggleBookmarks}
      >
        <p className="text-lg font-semibold">ブックマーク</p>
          <FontAwesomeIcon
            icon={isBookmarksOpen ? faChevronUp : faChevronDown}
            className="text-lg"
          />
        </div>

      {isBookmarksOpen && (
        <>
          <p className="text-md font-bold text-gray-500 items-center text-center mt-2 mb-4">
            ( 全 {bookmarks.length} 件 )
          </p>
          <div className="space-y-8 w-full lg:w-2/3 mx-auto">
            {bookmarks.length > 0 ? (
              bookmarks.map((bookmark) => {
                const sanitizedDescription = DOMPurify.sanitize(String(bookmark.description));
                return (
                  <Card
                    key={bookmark.id}
                    id={bookmark.id}
                    title={bookmark.title}
                    categoryId={bookmark.category_id}
                    isResolved={bookmark.is_resolved}
                    isDraft={bookmark.is_draft}
                    showReadMoreButton={false}
                    showViewCount={false}
                    footer={
                      <a
                        href={`/questions/${bookmark.id}`}
                        className="hoverScale px-3 py-1 rounded-md text-md text-semibold inline-block"
                      >
                        詳細を見る
                      </a>
                    }
                    type={'bookmarks'}
                  >
                    {bookmark.is_resolved && (
                      <div className="absolute top-0 right-4 font-semibold text-pink-500 px-4">
                        <FontAwesomeIcon icon={faAward} className="mr-2 text-3xl text-yellow-300" />解決済み
                      </div>
                    )}
                    <div
                      className={styles.questionBody}
                      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                    <div className="flex flex-wrap mt-4">
                      {bookmark.tags.map((tag: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined, index: Key | null | undefined) => (
                        <span
                          key={index}
                          className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full mr-2 mb-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center mt-4">
                      <UserProfileImage userId={bookmark.user_id} />
                      <div className="ml-4">
                        <UserNameDisplay userId={bookmark.user_id} />
                        <div className="text-left text-sm mt-2">
                          {bookmark.created_at
                            ? new Date(bookmark.created_at).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })
                            : '作成日登録なし'}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <p className="text-blue-900">ブックマークがありません。</p>
            )}
          </div>
        </>
      )}
    </section>
    </div>
  );
}